// controllers/DirectMessageController.js
import DirectMessage from "../models/DirectMessage.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    const file = req.file ? req.file.path : null;

    const msg = new DirectMessage({
      chatId,
      sender: req.user._id,
      message,
      file,
      isDelivered: false,
      isRead: false,
    });

    await msg.save();
    await msg.populate("sender", "name profileImage");

    res.status(201).json({ success: true, message: msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
};

export const getDirectMessages = async (req, res) => {
  try {
    const messages = await DirectMessage.find({ chatId: req.params.chatId })
      .populate("sender", "name profileImage")
      .sort({ createdAt: 1 });

    // Update read and delivered status
    await DirectMessage.updateMany(
      {
        chatId: req.params.chatId,
        sender: { $ne: req.user._id },
        isRead: false,
      },
      { isRead: true, isDelivered: true }
    );

    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
};
