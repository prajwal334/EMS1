// src/pages/DirectChat.jsx

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { useSocket } from "../../context/SocketContext";
import { FiSend, FiPaperclip } from "react-icons/fi";
import EmojiPicker from "emoji-picker-react";

const DirectChat = () => {
  const { id } = useParams(); // chatId
  const { user } = useAuth();
  const socket = useSocket();

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const scrollRef = useRef();

  useEffect(() => {
    const fetchChatData = async () => {
      const token = localStorage.getItem("token");

      const chatRes = await axios.get(
        `http://localhost:3000/api/direct-chats/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (chatRes.data.success) setChat(chatRes.data.chat);

      const msgRes = await axios.get(
        `http://localhost:3000/api/direct-messages/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (msgRes.data.success) setMessages(msgRes.data.messages);
    };

    fetchChatData();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join-chat", id);

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.emit("leave-chat", id);
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

  const getFileURL = (filePath) =>
    `http://localhost:3000/${filePath
      ?.replace(/^public[\\/]/, "")
      .replace(/\\/g, "/")}`;

  const handleSend = async () => {
    if (!message.trim() && !file) return;

    try {
      const formData = new FormData();
      formData.append("chatId", id);
      formData.append("message", message);
      if (file) formData.append("file", file);

      const res = await axios.post(
        "http://localhost:3000/api/direct-messages",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        socket.emit("send-message", res.data.message);
        setMessages((prev) => [...prev, res.data.message]);
        setMessage("");
        setFile(null);
      }
    } catch (err) {
      console.error("Send error:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white px-4 py-2 shadow flex items-center gap-3">
        <img
          src={
            chat?.recipient?.avatar
              ? getFileURL(chat.recipient.avatar)
              : "https://via.placeholder.com/100"
          }
          alt="Recipient"
          className="w-10 h-10 rounded-full object-cover"
        />
        <h2 className="text-lg font-semibold">{chat?.recipient?.name}</h2>
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
                      alt="file"
                      className="rounded max-h-48"
                    />
                  ) : (
                    <a
                      href={getFileURL(msg.file)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      📎 {msg.file.split("/").pop()}
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
        ))}
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

export default DirectChat;
