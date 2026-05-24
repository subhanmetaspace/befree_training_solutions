const nodemailer = require("nodemailer");

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error("[sendEmail] ERROR: GMAIL_USER or GMAIL_APP_PASSWORD not set in .env");
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
    },
});

const sendEmail = async (to, subject, html) => {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        console.error("[sendEmail] Cannot send — GMAIL_USER or GMAIL_APP_PASSWORD missing from .env");
        return;
    }
    try {
        const info = await transporter.sendMail({
            from: `"Digiweb Star Solution" <${GMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`[sendEmail] Sent to ${to} — MessageId: ${info.messageId}`);
    } catch (err) {
        console.error(`[sendEmail] Failed to send to ${to}`);
        console.error(`[sendEmail] Code: ${err.code} | Message: ${err.message}`);
        if (err.code === "ETIMEDOUT" || err.code === "ECONNREFUSED") {
            console.error("[sendEmail] Port 465 is also blocked by your hosting provider.");
            console.error("[sendEmail] You will need to ask them to unblock outgoing SMTP (port 465 or 587).");
        }
        if (err.code === "EAUTH") {
            console.error("[sendEmail] Wrong credentials — verify GMAIL_USER and GMAIL_APP_PASSWORD in .env");
            console.error("[sendEmail] App Password must be generated at: https://myaccount.google.com/apppasswords");
        }
    }
};

module.exports = sendEmail;
