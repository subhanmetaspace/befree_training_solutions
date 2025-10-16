const express = require("express");
const userRouter = express.Router();
const Joi = require("joi");
const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const Plans = require("../models/plansModel")
const {
  otpTemplate,
  registerTemplate,
  verifiedTemplate,
} = require("../helper/emailTemplates");
const sendEmail = require("../helper/sendEmail");
const UserSession = require("../models/userSessionModel");
const authMiddleware = require("../middleware/authenticate");
const  sendNotification  = require("../helper/notifications");
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const registerSchema = Joi.object({
  full_name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().max(100).required(),
  device: Joi.string().max(255).optional(),
  location: Joi.string().max(255).optional(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const verifyForgotOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).required(),
  new_password: Joi.string().min(6).max(100).required(),
});


const sendOtpMail = async (user, otp) => {
  const html = otpTemplate(otp);
  await sendEmail(user.email, "BeFree OTP Verification", html);
};

const sendRegisterationMail = async (user) => {
  const html = registerTemplate(user.full_name);
  await sendEmail(user.email, "Welcome to BeFree Training Solutions!", html);
};

const sendVerificationSuccessMail = async (user) => {
  const html = verifiedTemplate(user.full_name);
  await sendEmail(user.email, "Your Email has been verified!", html);
};

userRouter.post("/register", async (req, res) => {
  try {
    console.log("register api called")
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const { full_name, email, password } = req.body;
    const existingUser = await Users.findOne({ where: { email: email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }
    const hashedPass = bcrypt.hashSync(password, 10);
    const otp = generateOTP();
    const otpExpiredAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = await Users.create({
      full_name,
      email,
      password: hashedPass,
      otp,
      otp_expiration: otpExpiredAt,
    });

    (async () => {
      try {
        await sendRegisterationMail(user);
      } catch (err) {
        console.error("Error sending registration email:", err);
      }
    })();

    (async () => {
      try {
        await sendOtpMail(user, otp);
      } catch (err) {
        console.error("Error sending OTP email:", err);
      }
    })();

    await sendNotification({
  user_id: user.id,
  title: "Welcome to BeFree Training Solutions!",
  description: "You have successfully registered. Please verify your email to continue.",
  type: "achievement",
});

     
    return res
      .status(200)
      .json({
        success: true,
        message: "Registered at BeFree, Please check your email for OTP!",
      });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

userRouter.get('/profile',authMiddleware,async (req,res)=>{
  if(req.user){
    const planData = await Plans.findOne({
      where:{
        id:req.user.plan
      },
      raw:true
    })
     if (!planData) {
      return res.status(404).json({ success: false, message: "Plan not found!" });
    }
    const purchaseDate = new Date(req.user.plan_purchase_date || req.user.created_at);
    let expiryDate = new Date(purchaseDate);
    switch (planData.period) {
      case "day":
        expiryDate.setDate(expiryDate.getDate() + 1);
        break;
      case "week":
        expiryDate.setDate(expiryDate.getDate() + 7);
        break;
      case "month":
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        break;
      case "year":
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        break;
      default:
        expiryDate = null;
    }
    const data = {
      ...planData,
      expiry: expiryDate,
      full_name: req.user.full_name,
      email: req.user.email,
      created_at: req.user.created_at,
      popular: Boolean(planData.popular), // ensure boolean
    };
    return res.status(200).json({success:true,message:"Data fetched",data})
  }else{
    return res.status(200).json({success:false,message:"Data not available!"})
  }
})

userRouter.post("/login", async (req, res) => {
  try {
    console.log('login api called\n\n\n\n\n\n')
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }
    const { email, password, device, location } = req.body;
    const ip =
      req.headers['x-forwarded-for']?.split(',').shift() ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip;

    
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    if (!user.is_verified || user.is_verified == 0) {
      const otp = generateOTP();
      const otpExpiredAt = new Date(Date.now() + 10 * 60 * 1000);
      user.otp = otp;
      user.otp_expiration = otpExpiredAt;
      await user.save();
      (async ()=>{
        try{
          await sendOtpMail(user, otp);
        }catch(err){
          console.error("error sending otp",err)
        }
      })()
      return res
        .status(200)
        .json({ success: false, message: "Email is not verified! OTP sent to your email.", isOtp:true });
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(400).json({success:false,message:"Incorrect credentials!"})
    }
    const token = jwt.sign(
        {id:user.id,email:user.email},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )
    user.is_active=1;
    await user.save();
    await UserSession.create({
      user_id:user.id,
      device: device,
      location: location,
      ip_address: ip,
      lastActive: new Date(),
    })
     await sendNotification({
  user_id: user.id,
  title: "Login Successful",
  description: `You logged in from ${device || "unknown device"} at ${new Date().toLocaleString()}`,
  type: "subscription",
});

// Optionally, check plan status
if (!user.plan) {
  await sendNotification({
    user_id: user.id,
    title: "No Plan Found",
    description: "You have not purchased any plan yet. Upgrade to unlock full features.",
    type: "subscription",
  });
} else {
  await sendNotification({
    user_id: user.id,
    title: "Plan Active",
    description: `Your current free plan is active. Upgrade plan to unlock features!`,
    type: "subscription",
  });
}
await sendNotification({
    user_id: user.id,
    title: "Upgrade Plan",
    description: `Upgrade you plan, to checkout all the features!`,
    type: "subscription",
  });
    return res.status(200).json({success:true,message:"login successful",data:{token,name:user.full_name,email:user.email,id:user.id}})
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

userRouter.post("/verify",async (req,res)=>{
  try{
    const {error} = verifyOtpSchema.validate(req.body)
    if(error){
      return res.status(400).json({success:false,message:error.details[0].message})
    }
    const {email,otp} = req.body;
    const user = await Users.findOne({where:{email}})
    if(!user){
      return res.status(400).json({success:false,message:'user not found'})
    }
    if(user.is_verified){
      return res.status(400).json({success:false,message:"user is already verified"})
    }
    if(user.otp!=otp){
      return res.status(400).json({success:false,message:"Invalid OTP"})
    }
    if(user.otp_expiration< new Date()){
      return res.status(400).json({success:false,message:"OTP expired"})
    }
    user.is_verified = 1;
    user.otp = null;
    user.otp_expiration = null;
    await user.save();
    (async ()=>{
      try{
        await sendVerificationSuccessMail(user)
      }catch(err){
        console.error("error sending success mail",err)
      }
    })()
    await sendNotification({
  user_id: user.id,
  title: "Email Verified",
  description: "Your email has been successfully verified. You can now log in.",
  type: "achievement",
});

    return res.status(200).json({success:true,message:"Email verified successfully"})
  }catch(error){
    console.error(error)
    return res.status(500).json({success:false,message:error.message})
  }
})

userRouter.post('/logout',authMiddleware,async (req,res)=>{
  try{  
    const id=req.user.id;
    if(!id){
      return res.status(400).json({success:false,message:'id is required'})
    }
    if(typeof id!='number'){
      return res.status(400).json({success:false,message:"id must be a number"})
    }
    const user = await Users.findOne({where:{id:id}})
    if(!user){
      return res.status(400).json({success:false,message:"user not found"})
    }
    const ip =
      req.headers['x-forwarded-for']?.split(',').shift() ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip;
    await UserSession.update({is_active:0},{where:{user_id:id,ip_address:ip}})
    console.log("user logout successfully\n\n\n\n\n\n")
    

    user.is_active = 0;
    await user.save();
    await sendNotification({
  user_id: user.id,
  title: "Logged Out",
  description: "You have successfully logged out.",
  type: "achievement",
});
    return res.status(200).json({success:true,message:"logged out successfully!"})
  }catch(err){
    console.error(err)
    return res.status(500).json({success:false,message:err.message})
  }
})

userRouter.post("/forgot-password", async (req, res) => {
  try {
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email } = req.body;
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpiredAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    user.otp = otp;
    user.otp_expiration = otpExpiredAt;
    await user.save();

    await sendOtpMail(user, otp);

    return res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

userRouter.post("/verify-forgot-otp", async (req, res) => {
  try {
    const { error } = verifyForgotOtpSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email, otp } = req.body;
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.otp_expiration < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    return res.status(200).json({ success: true, message: "OTP verified successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

userRouter.post("/reset-password", async (req, res) => {
  try {
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { email, otp, new_password } = req.body;
    const user = await Users.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (user.otp_expiration < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    user.password = bcrypt.hashSync(new_password, 10);
    user.otp = null;
    user.otp_expiration = null;
    await user.save();

    await sendNotification({
      user_id: user.id,
      title: "Password Changed",
      description: "Your password has been updated successfully.",
      type: "achievement",
    });

    return res.status(200).json({ success: true, message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
});


module.exports = userRouter;
