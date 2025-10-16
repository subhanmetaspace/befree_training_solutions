const express = require("express")
const supportRouter = express.Router();
const Joi = require('joi');
const ContactUs = require("../models/contactUsModel");
const sendEmail = require("../helper/sendEmail");
const { contactUserTemplate, supportUserTemplate } = require("../helper/emailTemplates");
const SupportTicket = require("../models/supportTicketModel");
const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage:storage})
const fs = require('fs');
const  authMiddleware  = require("../middleware/authenticate");

const checkFileSignature = (buffer) => {
  const fileSignatures = {
    "89504E470D0A1A0A": "PNG",
    FFD8FFE0: "JPEG",
    FFD8FF: "JPG",
    // Add more file signatures as needed
  };

  // Convert the buffer's first few bytes to a hex string
  const hexSignature = buffer.slice(0, 8).toString("hex").toUpperCase();

  // Check the hex signature against known file signatures
  for (const signature in fileSignatures) {
    if (hexSignature.startsWith(signature)) {
      return fileSignatures[signature];
    }
  }

  // If no match is found, return null or an appropriate value
  return null;
};

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  message: Joi.string().min(6).max(500).required(),
  subject: Joi.string().min(2).max(100).required()
});

const ticketSchema = Joi.object({
  user_id: Joi.number().integer().optional(),
  subject: Joi.string().max(150).required(),
  message: Joi.string().required(),
//   email:Joi.string().email().required()
});

supportRouter.post("/contact",async (req,res)=>{
    try{
        const {error} = contactSchema.validate(req.body)
        if(error){
            return res.status(400).json({success:false,message:error.details[0].message})
        }
        const {name,email,message,subject} = req.body;
        const contact = await ContactUs.create({
            name,email,subject,message
        })
        sendEmail(email,'Thank you for contacting us!',contactUserTemplate({name:name})).catch(console.error)
        return res.status(200).json({success:true,message:"Thank you for contacting us, we will get back to you soon!"})
    }catch(err){
        console.error(err)
        return res.status(500).json({success:false,message:err.message})
    }
})

supportRouter.post("/ticket/submit",authMiddleware,upload.single("attachment"),async (req,res)=>{
    try{
        const {error} = ticketSchema.validate(req.body)
        if(error){
            return res.status(400).json({success:false,message:error.details[0].message})
        }
        const {subject,message} = req.body
        const user_id = req.user.id;
        const email = req.user.email;
        let attachment;
        if(req.file){
            const signature = checkFileSignature(req.file.buffer)
            if(!signature){
                return res.status(400).json({success:false,message:"Invalid file format"})
            }else if(req.file.size>2000000){
                return res.status(400).json({success:false,message:"Image file must not be greater than 200kb"})
            }else{
                attachment = `${Date.now()}-${req.file.originalname}`
                fs.writeFile(`uploads/${attachment}`,req.file.buffer,(err) => {
                    if (err) {
                      console.log("error saving banner image", err);
                      return res
                        .status(500)
                        .json({ success: false, message: "Error saving file" });
                    }
                })
            }
        }else{
            attachment = null;
        }
        const ticket = await SupportTicket.create({
            user_id,subject,message,attachment
        })
        
        sendEmail(email,'Your Ticket has been submitted!',supportUserTemplate({name:"User",subject,ticketId:ticket.id})).catch(console.error)
        return res.status(200).json({success:true,message:'support ticket created!'})
    }catch(err){
        console.error(err)
        return res.status(500).json({success:false,message:err.message})
    }
})


module.exports = supportRouter