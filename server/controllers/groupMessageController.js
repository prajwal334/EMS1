// controllers/groupMessageController.js
import GroupMessage from "../models/GroupMessage.js";
import Group from "../models/GroupChat.js"; // Make sure you import Group model

export const addGroupMessage = async (req, res) => {
  try {
    const { groupId, message } = req.body;
    const file = req.file ? req.file.path : null;

    // Check if user is a member of the group
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, error: "Group not found" });
    }

    const isMember = group.members.some(member => member.toString() === req.user._id.toString());

    // Allow only group members or admin
    if (!isMember && req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "You are not a member of this group" });
    }

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
    console.error("Send message failed:", err);
    res.status(500).json({ success: false, error: "Failed to send message" });
  }
};



export const getGroupMessages = async (req, res) => {
  try {
    const groupId = req.params.groupId;

    // Fetch group first
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, error: "Group not found" });
    }

    const isMember = group.members.some(
      (memberId) => memberId.toString() === req.user._id.toString()
    );

    if (!isMember && req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Access denied" });
    }

    const messages = await GroupMessage.find({ groupId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    // Mark other users' messages as read
    await GroupMessage.updateMany(
      { groupId, sender: { $ne: req.user._id } },
      { isRead: true }
    );

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Message fetch error:", error);
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

// controllers/groupMessageController.js
export const reactToMessage = async (req, res) => {
  const { emoji } = req.body;
  const { id } = req.params;

  try {
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    // Initialize reactions array if missing
    if (!message.reactions) {
      message.reactions = [];
    }

    message.reactions.push(emoji);
    await message.save();

    res.json({ success: true, message });
  } catch (err) {
    console.error("Error reacting to message:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const forwardMessage = async (req, res) => {
  try {
    const { originalMessageId, targetGroupId } = req.body;
    const originalMessage = await GroupMessage.findById(originalMessageId);
    if (!originalMessage) return res.status(404).json({ success: false, error: "Original message not found" });

    const newMessage = new GroupMessage({
      groupId: targetGroupId,
      sender: req.user._id,
      message: originalMessage.message,
      file: originalMessage.file,
    });

    await newMessage.save();
    await newMessage.populate("sender", "name");

    res.status(201).json({ success: true, message: newMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to forward message" });
  }
};

