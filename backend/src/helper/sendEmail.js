const nodemailer = require("nodemailer");

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

// Startup check — shows in pm2 logs so you can confirm values are loaded
if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    console.error("[sendEmail] ERROR: GMAIL_USER or GMAIL_APP_PASSWORD missing from .env");
} else {
    console.log(`[sendEmail] Gmail ready — user: ${GMAIL_USER} | pass length: ${GMAIL_APP_PASSWORD.length} chars`);
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
        console.error("[sendEmail] Cannot send — credentials missing from .env");
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
        console.error(`[sendEmail] Failed — Code: ${err.code} | Message: ${err.message}`);
    }
};

module.exports = sendEmail;
