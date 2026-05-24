const { google } = require("googleapis");

const GMAIL_USER         = process.env.GMAIL_USER;
const GMAIL_CLIENT_ID    = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

const missingVars = [];
if (!GMAIL_USER)          missingVars.push("GMAIL_USER");
if (!GMAIL_CLIENT_ID)     missingVars.push("GMAIL_CLIENT_ID");
if (!GMAIL_CLIENT_SECRET) missingVars.push("GMAIL_CLIENT_SECRET");
if (!GMAIL_REFRESH_TOKEN) missingVars.push("GMAIL_REFRESH_TOKEN");

if (missingVars.length > 0) {
    console.warn(`[sendEmail] WARNING: Missing env vars: ${missingVars.join(", ")}`);
} else {
    console.log("[sendEmail] Gmail API (HTTPS) ready — no SMTP ports needed");
}

const getGmailClient = () => {
    const oauth2Client = new google.auth.OAuth2(
        GMAIL_CLIENT_ID,
        GMAIL_CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );
    oauth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
    return google.gmail({ version: "v1", auth: oauth2Client });
};

const buildRawMessage = (to, subject, html) => {
    const messageParts = [
        `From: "Digiweb Star Solution" <${GMAIL_USER}>`,
        `To: ${to}`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        "Content-Type: text/html; charset=utf-8",
        "",
        html,
    ];
    const message = messageParts.join("\n");
    return Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
};

const sendEmail = async (to, subject, html) => {
    if (missingVars.length > 0) {
        console.error(`[sendEmail] Cannot send — missing: ${missingVars.join(", ")}`);
        return;
    }
    try {
        const gmail = getGmailClient();
        const raw = buildRawMessage(to, subject, html);
        const res = await gmail.users.messages.send({
            userId: "me",
            requestBody: { raw },
        });
        console.log(`[sendEmail] Sent to ${to} — Gmail Message ID: ${res.data.id}`);
    } catch (err) {
        console.error(`[sendEmail] Failed to send to ${to}`);
        console.error(`[sendEmail] Error: ${err.message}`);
        if (err.message?.includes("invalid_grant") || err.message?.includes("Invalid Credentials")) {
            console.error("[sendEmail] >>> Refresh token is invalid or expired.");
            console.error("[sendEmail] >>> Generate a new one at: https://developers.google.com/oauthplayground");
        }
        if (err.message?.includes("insufficient authentication")) {
            console.error("[sendEmail] >>> Gmail API not enabled or OAuth consent not configured.");
        }
    }
};

module.exports = sendEmail;
