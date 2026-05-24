const nodemailer = require("nodemailer");

const BREVO_USER = process.env.BREVO_SMTP_USER;
const BREVO_PASS = process.env.BREVO_SMTP_PASS;
const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

let transporter;

if (BREVO_USER && BREVO_PASS) {
    transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: BREVO_USER,
            pass: BREVO_PASS,
        },
    });
    console.log("[sendEmail] Using Brevo SMTP");
} else if (GMAIL_USER && GMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD,
        },
        tls: { rejectUnauthorized: false },
    });
    console.log("[sendEmail] Using Gmail SMTP (note: port 587 may be blocked on some servers)");
} else {
    console.error("[sendEmail] ERROR: No email credentials set. Add BREVO_SMTP_USER + BREVO_SMTP_PASS (recommended) or GMAIL_USER + GMAIL_APP_PASSWORD to your .env");
}

const FROM_NAME = "Digiweb Star Solution";
const FROM_ADDRESS = BREVO_USER || GMAIL_USER;

const sendEmail = async (to, subject, html) => {
    if (!transporter) {
        console.error("[sendEmail] Cannot send — no transporter configured. Check your .env file.");
        return;
    }
    try {
        const info = await transporter.sendMail({
            from: `"${FROM_NAME}" <${FROM_ADDRESS}>`,
            to,
            subject,
            html,
        });
        console.log(`[sendEmail] Sent to ${to} — MessageId: ${info.messageId}`);
    } catch (err) {
        console.error(`[sendEmail] Failed to send to ${to}`);
        console.error(`[sendEmail] Code: ${err.code} | Command: ${err.command}`);
        console.error(`[sendEmail] Message: ${err.message}`);
        if (err.code === "ETIMEDOUT" || err.code === "ECONNREFUSED") {
            console.error("[sendEmail] >>> SMTP port is BLOCKED by your server. Switch to Brevo — add BREVO_SMTP_USER and BREVO_SMTP_PASS to .env");
        }
        if (err.code === "EAUTH") {
            console.error("[sendEmail] >>> Authentication failed — check your credentials in .env");
        }
    }
};

module.exports = sendEmail;
