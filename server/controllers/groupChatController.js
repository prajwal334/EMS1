import Group from "../models/GroupChat.js";

export const createGroup = async (req, res) => {
  try {
    const { group_name, members } = req.body;

    if (!group_name || !members) {
      return res
        .status(400)
        .json({ success: false, error: "Group name and members are required" });
    }

    const groupExists = await Group.findOne({ group_name });
    if (groupExists) {
      return res
        .status(400)
        .json({ success: false, error: "Group with this name already exists" });
    }

    const group = new Group({
      group_name,
      createdBy: req.user._id,
      members: Array.isArray(members) ? members : [members],
      group_dp: req.file ? req.file.path : null,
    });

    await group.save();

    res.status(201).json({ success: true, message: "Group created", group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getAllGroups = async (req, res) => {
  try {
    const groups = await Group.find()
      .populate("createdBy", "name")
      .populate("members", "name");

    res.status(200).json({ success: true, groups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("members", "name");

    if (!group) {
      return res
        .status(404)
        .json({ success: false, error: "Group not found" });
    }

    res.status(200).json({ success: true, group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
