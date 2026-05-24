const nodemailer = require("nodemailer");

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.warn("[sendEmail] WARNING: GMAIL_USER or GMAIL_APP_PASSWORD is not set in .env");
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
        rejectUnauthorized: false,
    },
});

const sendEmail = async (to, subject, html) => {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        console.error("[sendEmail] Cannot send email — GMAIL_USER or GMAIL_APP_PASSWORD missing from .env");
        return;
    }
    try {
        const info = await transporter.sendMail({
            from: `"Digiweb Star Solution" <${GMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html,
        });
        console.log(`[sendEmail] Email sent to ${to} — MessageId: ${info.messageId}`);
    } catch (err) {
        console.error(`[sendEmail] Failed to send to ${to}`);
        console.error(`[sendEmail] Code: ${err.code} | Command: ${err.command}`);
        console.error(`[sendEmail] Message: ${err.message}`);
        if (err.code === "ETIMEDOUT" || err.code === "ECONNREFUSED") {
            console.error("[sendEmail] >>> SMTP port is likely BLOCKED by your server/hosting. See fix below:");
            console.error("[sendEmail] >>> Option 1: Ask your VPS provider to unblock port 587");
            console.error("[sendEmail] >>> Option 2: Use Brevo (sendinblue.com) SMTP — free, no port restrictions");
        }
        if (err.code === "EAUTH") {
            console.error("[sendEmail] >>> Authentication failed — check GMAIL_USER and GMAIL_APP_PASSWORD in .env");
            console.error("[sendEmail] >>> Make sure you are using a Gmail App Password, not your regular Gmail password");
            console.error("[sendEmail] >>> Generate one at: https://myaccount.google.com/apppasswords");
        }
    }
};

module.exports = sendEmail;
