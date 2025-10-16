const Notification = require("../models/notificationModel");

const sendNotification = async ({ user_id, title, description, type }) => {
    console.log("send notification function called\n\n\n\n\n\n\n")
  try {
    const notif = await Notification.create({
      user_id,
      title,
      description,
      type,
      read: false,
    });

    console.log(`Notification sent: ID ${notif.id} for user ${user_id}`);
    return notif; // optional if you want to use it elsewhere
  } catch (err) {
    console.error("Error sending notification:", err);
  }
};

module.exports = sendNotification ;
