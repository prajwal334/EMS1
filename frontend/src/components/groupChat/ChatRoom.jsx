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
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [showMembers, setShowMembers] = useState(false);

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
      // ✅ Emit the fully saved message from backend
      socket.emit("send-message", res.data.message);
      setMessages((prev) => [...prev, res.data.message]);
    }

    setMessage("");
    setFile(null);
  } catch (err) {
    console.error("Send error", err);
  }
};


  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getFileURL = (filePath) =>
    `http://localhost:3000/${filePath.replace("public/", "")}`;

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white flex items-center justify-between px-4 py-2 shadow-md">
        <div className="flex items-center gap-3">
          <img
            src={
              group?.group_dp
                ? getFileURL(group.group_dp)
                : "https://via.placeholder.com/100"
            }
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
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`mb-2 flex ${
              msg.sender._id === user._id ? "justify-end" : "justify-start"
            }`}
          >
            <div className="max-w-xs bg-white rounded-xl p-3 shadow relative">
              <div className="text-sm text-gray-800 break-words">
                {msg.message}
              </div>
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
              <div className="text-xs text-right text-gray-500 mt-1">
                {formatTime(msg.createdAt)}
              </div>
            </div>
          </div>
        ))}
        <div ref={scrollRef}></div>
      </div>

      {/* Input Box */}
      <div className="bg-white px-4 py-3 flex items-center gap-2 border-t relative">
        {/* File upload */}
        <label htmlFor="file" className="cursor-pointer text-xl text-gray-600">
          <FiPaperclip />
        </label>
        <input
          id="file"
          type="file"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* Emoji */}
        <button onClick={() => setShowEmojiPicker((prev) => !prev)}>😊</button>
        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 z-50">
            <EmojiPicker onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)} />
          </div>
        )}

        {/* Text input */}
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 px-4 py-2 border rounded-full focus:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        {/* Send button */}
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
