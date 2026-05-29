exports.otpTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; background: #f8f9fa; padding: 30px;">
    <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 8px; padding: 30px; text-align: center;">
      <h2 style="color: #00b4d8;">🔐 Email Verification</h2>
      <p style="font-size: 16px; color: #333;">Use the following OTP to verify your email:</p>
      <h1 style="letter-spacing: 5px; color: #111;">${otp}</h1>
      <p style="color: #555;">This OTP will expire in 10 minutes.</p>
      <hr style="margin: 20px 0;" />
      <p style="font-size: 14px; color: #777;">If you did not request this, please ignore this email.</p>
      <p style="font-size: 12px; color: #aaa;">Digiweb Star Solution Pvt Ltd — learnwithdigiweb.com</p>
    </div>
  </div>
`;

exports.registerTemplate = (fullName) => `
  <div style="font-family: Arial, sans-serif; background: #f8f9fa; padding: 30px;">
    <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 8px; padding: 30px; text-align: center;">
      <h2 style="color: #00b4d8;">👋 Welcome to Digiweb Star, ${fullName}!</h2>
      <p style="font-size: 16px; color: #333;">Your account has been created successfully. Please verify your email to continue.</p>
      <p style="color: #555;">Check your inbox for the OTP verification email we just sent you.</p>
      <hr style="margin: 20px 0;" />
      <p style="font-size: 14px; color: #777;">Need help? Contact us at <a href="mailto:info.digiwebstar123@gmail.com" style="color: #00b4d8;">info.digiwebstar123@gmail.com</a></p>
      <p style="font-size: 12px; color: #aaa;">Digiweb Star Solution Pvt Ltd — learnwithdigiweb.com</p>
    </div>
  </div>
`;

exports.verifiedTemplate = (fullName) => `
  <div style="font-family: Arial, sans-serif; background: #f8f9fa; padding: 30px;">
    <div style="max-width: 600px; background: #ffffff; margin: auto; border-radius: 8px; padding: 30px; text-align: center;">
      <h2 style="color: #16a34a;">✅ Verification Successful!</h2>
      <p style="font-size: 16px; color: #333;">Hi ${fullName}, your email has been verified successfully.</p>
      <p style="color: #555;">You can now access all courses and features on learnwithdigiweb.com.</p>
      <hr style="margin: 20px 0;" />
      <p style="font-size: 14px; color: #777;">Thank you for choosing Digiweb Star Solution Pvt Ltd!</p>
      <p style="font-size: 12px; color: #aaa;">Digiweb Star Solution Pvt Ltd — learnwithdigiweb.com</p>
    </div>
  </div>
`;

exports.contactHTMLTemplate = ({ name, email, message }) => `
<div style="font-family: sans-serif; color: #333;">
  <h2>New Contact Request — Digiweb Star</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Message:</strong></p>
  <p>${message}</p>
</div>
`;

exports.contactUserTemplate = ({ name }) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Thank You for Contacting Us</title>
<style>
  body { font-family: Arial, sans-serif; margin:0; padding:0; background-color:#f9f9f9; }
  .container { max-width:600px; margin:20px auto; background-color:#ffffff; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
  h2 { color:#333333; }
  p { color:#555555; line-height:1.5; }
  a { color:#00b4d8; text-decoration:none; }
  .footer { font-size:12px; color:#888888; margin-top:20px; text-align:center; }
</style>
</head>
<body>
  <div class="container">
    <h2>Hello ${name},</h2>
    <p>Thank you for reaching out to Digiweb Star Support! We have received your message and our team will get back to you as soon as possible.</p>
    <p>If you need urgent assistance, contact us at <a href="mailto:info.digiwebstar123@gmail.com">info.digiwebstar123@gmail.com</a> or call <a href="tel:+918108673614">+91 81086 73614</a>.</p>
    <p>Best regards,<br>Digiweb Star Support Team</p>
    <div class="footer">
      © ${new Date().getFullYear()} Digiweb Star Solution Pvt Ltd. All rights reserved. | learnwithdigiweb.com
    </div>
  </div>
</body>
</html>
`;

exports.supportTicketHTMLTemplate = ({ subject, message, attachment }) => `
<div style="font-family: sans-serif; color: #333;">
  <h2>New Support Ticket — Digiweb Star</h2>
  <p><strong>Subject:</strong> ${subject}</p>
  <p><strong>Message:</strong></p>
  <p>${message}</p>
  ${attachment ? `<p><strong>Attachment:</strong> ${attachment}</p>` : ""}
</div>
`;

exports.supportUserTemplate = ({ name, subject, ticketId }) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Support Ticket Submitted</title>
<style>
  body { font-family: Arial, sans-serif; margin:0; padding:0; background-color:#f9f9f9; }
  .container { max-width:600px; margin:20px auto; background-color:#ffffff; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
  h2 { color:#333333; }
  p { color:#555555; line-height:1.5; }
  a { color:#00b4d8; text-decoration:none; }
  .footer { font-size:12px; color:#888888; margin-top:20px; text-align:center; }
</style>
</head>
<body>
  <div class="container">
    <h2>Hello ${name},</h2>
    <p>Your support ticket has been successfully submitted.</p>
    <p><strong>Ticket ID:</strong> ${ticketId}<br>
       <strong>Subject:</strong> ${subject}</p>
    <p>Our support team will review your ticket and get back to you as soon as possible.</p>
    <p>For further questions, contact us at <a href="mailto:info.digiwebstar123@gmail.com">info.digiwebstar123@gmail.com</a>.</p>
    <p>Thank you for choosing Digiweb Star Solution Pvt Ltd!</p>
    <div class="footer">
      © ${new Date().getFullYear()} Digiweb Star Solution Pvt Ltd. All rights reserved. | learnwithdigiweb.com
    </div>
  </div>
</body>
</html>
`;
