// controllers/groupMessageController.js
import GroupMessage from "../models/GroupMessage.js";

export const addGroupMessage = async (req, res) => {
  try {
    const { groupId, message } = req.body;
    const file = req.file ? req.file.path : null;

    const newMessage = new GroupMessage({
      groupId,
      sender: req.user._id,
      message,
      file,
    });

    await newMessage.save();
    await newMessage.populate("sender", "name");

    res.status(201).json({ success: true, message: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const messages = await GroupMessage.find({ groupId: req.params.groupId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    // Mark others' messages as read
    await GroupMessage.updateMany(
      { groupId: req.params.groupId, sender: { $ne: req.user._id } },
      { isRead: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to fetch messages" });
  }
};

export const updateGroupMessage = async (req, res) => {
  try {
    const updated = await GroupMessage.findByIdAndUpdate(
      req.params.id,
      { message: req.body.message },
      { new: true }
    );
    res.json({ success: true, updated });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update message" });
  }
};

export const deleteGroupMessage = async (req, res) => {
  try {
    await GroupMessage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete message" });
  }
};
