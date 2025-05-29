// controllers/notificationController.js
import NotificationSetting from "../models/NotificationSetting.js";

export const getNotificationSettings = async (req, res) => {
  try {
    const setting = await NotificationSetting.findOne({ user: req.user._id });
    if (!setting) {
      return res.json({ chatNotification: true, groupNotification: true }); // default
    }
    res.json(setting);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load notification settings" });
  }
};
