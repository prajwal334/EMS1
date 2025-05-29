import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/authContext";
import EmojiPicker from "emoji-picker-react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiSend, FiPaperclip } from "react-icons/fi";

const ChatRoom = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const socket = useSocket();

  const [group, setGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const scrollRef = useRef();

  useEffect(() => {
    const fetchChat = async () => {
      const token = localStorage.getItem("token");

      const groupRes = await axios.get(`http://localhost:3000/api/group/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (groupRes.data.success) setGroup(groupRes.data.group);

      const msgRes = await axios.get(`http://localhost:3000/api/messages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (msgRes.data.success) setMessages(msgRes.data.messages);
    };
    fetchChat();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join-group", id);
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.emit("leave-group", id);
      socket.off("receive-message");
    };
  }, [socket, id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getFileURL = (filePath) => {
    if (!filePath) return "https://via.placeholder.com/100";
    const cleanedPath = filePath.replace(/^public[\\/]/, "").replace(/\\/g, "/");
    return `http://localhost:3000/${cleanedPath}`;
  };

  const handleSend = async () => {
    if (!message.trim() && !file) return;

    try {
      const formData = new FormData();
      formData.append("groupId", id);
      formData.append("message", message);
      if (file) formData.append("file", file);

      const res = await axios.post("http://localhost:3000/api/messages", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        socket.emit("send-message", res.data.message);
        setMessages((prev) => [...prev, res.data.message]);
      }

      setMessage("");
      setFile(null);
    } catch (err) {
      console.error("Send error", err);
    }
  };

  const handleEdit = (msg) => {
    setEditingMsgId(msg._id);
    setEditedText(msg.message);
  };

  const saveEditedMessage = async () => {
    try {
      const res = await axios.put(
        `http://localhost:3000/api/messages/${editingMsgId}`,
        { message: editedText },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg._id === editingMsgId ? { ...msg, message: editedText } : msg
          )
        );
        setEditingMsgId(null);
        setEditedText("");
      }
    } catch (err) {
      console.error("Edit error", err);
    }
  };

  const handleDelete = async (msgId) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await axios.delete(`http://localhost:3000/api/messages/${msgId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data.success) {
        setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white flex items-center justify-between px-4 py-2 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src={group?.group_dp ? getFileURL(group.group_dp) : "https://via.placeholder.com/100"}
            className="w-10 h-10 rounded-full object-cover"
            alt="group"
          />
          <h2 className="text-lg font-semibold">{group?.group_name}</h2>
        </div>
        <div className="relative">
          <BsThreeDotsVertical
            className="text-xl cursor-pointer"
            onClick={() => setShowMembers(!showMembers)}
          />
          {showMembers && (
            <div className="absolute right-0 mt-2 w-48 bg-white border shadow-lg rounded z-50 p-2">
              <h4 className="font-semibold text-sm mb-1">Group Members</h4>
              <ul className="text-sm text-gray-800 space-y-1 max-h-40 overflow-y-auto">
                {group?.members?.map((m) => (
                  <li key={m._id}>👤 {m.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => {
          const canEdit =
            msg.sender._id === user._id || user.role === "admin";
          return (
            <div
              key={msg._id}
              className={`mb-2 flex ${
                msg.sender._id === user._id ? "justify-end" : "justify-start"
              } group relative`}
            >
              <div className="max-w-xs bg-white rounded-xl p-3 shadow relative">
                {/* Hover Buttons */}
                {canEdit && (
                  <div className="absolute top-1 right-1 hidden group-hover:flex gap-1 z-10">
                    <button
                      onClick={() => handleEdit(msg)}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(msg._id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}

                {editingMsgId === msg._id ? (
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="border px-2 py-1 rounded text-sm"
                    />
                    <div className="flex gap-2 text-xs text-right">
                      <button
                        onClick={saveEditedMessage}
                        className="text-green-600 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingMsgId(null)}
                        className="text-gray-500 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-800 break-words">
                    {msg.message}
                  </div>
                )}

                {msg.file && (
                  <div className="mt-2">
                    {msg.file.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={getFileURL(msg.file)}
                        alt="attachment"
                        className="rounded max-h-48"
                      />
                    ) : (
                      <a
                        href={getFileURL(msg.file)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        📎 Download file
                      </a>
                    )}
                  </div>
                )}
                <div className="text-xs text-right text-gray-500 mt-1 flex items-center gap-1">
  {formatTime(msg.createdAt)}
  {msg.sender._id === user._id && (
    <>
      {msg.isRead ? (
        <span className="text-blue-500">✔✔</span>
      ) : msg.isDelivered ? (
        <span>✔✔</span>
      ) : (
        <span>✔</span>
      )}
    </>
  )}
</div>

              </div>
            </div>
          );
        })}
        <div ref={scrollRef}></div>
      </div>

      {/* File Preview */}
      {file && (
        <div className="px-4 pb-2 relative">
          {file.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              className="w-32 h-auto rounded"
            />
          ) : (
            <div className="text-sm text-gray-700 bg-gray-200 px-3 py-1 rounded inline-block">
              📎 {file.name}
            </div>
          )}
          <button
            onClick={() => setFile(null)}
            className="absolute top-0 right-4 text-red-500 hover:text-red-700 text-xl"
            title="Remove File"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Box */}
      <div className="bg-white px-4 py-3 flex items-center gap-2 border-t relative">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Type a message"
            className="w-full pl-10 pr-20 py-2 border rounded-full focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          {/* File Upload Icon */}
          <label
            htmlFor="file"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
          >
            <FiPaperclip />
          </label>
          <input
            id="file"
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />

          {/* Emoji Picker */}
          <button
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            😊
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-14 left-0 z-50">
              <EmojiPicker
                onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)}
              />
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          className="text-white bg-blue-600 rounded-full p-2 hover:bg-blue-700"
        >
          <FiSend className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
