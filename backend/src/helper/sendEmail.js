const nodemailer = require("nodemailer");

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
    },
});

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: `"Digiweb Star Support" <${GMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html,
        });
        console.log(`Email sent to ${to}`);
    } catch (err) {
        console.error("Failed to send email:", err);
    }
};

module.exports = sendEmail;
