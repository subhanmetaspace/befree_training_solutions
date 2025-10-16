const express = require("express");
const notificationRouter = express.Router();
const Joi = require("joi");
const authMiddleware = require("../middleware/authenticate");
const Notification = require("../models/notificationModel");

// Validation schemas
const createNotificationSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  title: Joi.string().max(255).required(),
  description: Joi.string().required(),
  type: Joi.string().valid("course", "subscription", "achievement").required(),
});

const markAsReadSchema = Joi.object({
  id: Joi.number().integer().required(),
});

// Get all notifications for user
notificationRouter.get("/", authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { user_id: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.json({ success: true, data: notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Mark a notification as read
notificationRouter.put("/:id/read", authMiddleware, async (req, res) => {
  const { error, value } = markAsReadSchema.validate({ id: req.params.id });
  if (error) return res.status(400).json({ success: false, message: "Invalid notification ID" });

  try {
    const notification = await Notification.findByPk(value.id);
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });

    notification.read = true;
    await notification.save();

    res.json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Create a notification
notificationRouter.post("/", authMiddleware, async (req, res) => {
  const { error, value } = createNotificationSchema.validate(req.body);
  if (error) return res.status(400).json({ success: false, message: error.details[0].message });

  try {
    const notification = await Notification.create(value);
    res.json({ success: true, message: "Notification created", data: notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = notificationRouter;
