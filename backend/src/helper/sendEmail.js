// const nodemailer = require("nodemailer")
// const Dotenv = require("dotenv")
// Dotenv.config();

// const transporter = nodemailer.createTransport({
//     host: "mail.smtp2go.com",
//   port: 2525,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// })

// const sendEmail = async (to,subject,html)=>{
//     try{
//         await transporter.sendMail({
//             from:`"BeFree Support" <${process.env.SMTP_EMAIL||process.env.SMTP_USER}>`,
//             to:to,
//             subject:subject,
//             html:html
//         })
//     }catch(err){
//         console.error('failed to send email ',err)
//     }
// }

// module.exports = sendEmail;


const nodemailer = require("nodemailer");

// Use environment variables for sensitive info
const GMAIL_USER = process.env.GMAIL_USER || "befreeeducation7107@gmail.com";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD; // 16-char App Password from Gmail

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
    },
});

// Send email function
const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"BeFree Training Support" <${GMAIL_USER}>`, // sender address
            to: to,                                     // recipient
            subject: subject,
            html: html,                                 // html body
        });
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error("Failed to send email:", err);
    }
};

module.exports = sendEmail;
