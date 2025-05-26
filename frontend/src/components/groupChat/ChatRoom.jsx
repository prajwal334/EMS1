// ChatRoom.jsx
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/authContext";
import EmojiPicker from "emoji-picker-react";

const ChatRoom = () => {
  const { id } = useParams(); // groupId
  const { user } = useAuth();
  const socket = useSocket();

  const [group, setGroup] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingMsgId, setEditingMsgId] = useState(null);
  const [typingUser, setTypingUser] = useState(null);
  const [file, setFile] = useState(null);

  const scrollRef = useRef();
  const typingTimeoutRef = useRef(null);

  // Fetch messages & group info
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/group/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (res.data.success) {
          setGroup(res.data.group);
        }

        const msgRes = await axios.get(`http://localhost:3000/api/messages/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (msgRes.data.success) {
          setMessages(msgRes.data.messages);
        }
      } catch (err) {
        console.error("Fetch error", err);
      }
    };

    fetchChat();
  }, [id]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join-group", id);

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", (name) => {
      setTypingUser(name);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        setTypingUser(null);
      }, 2000);
    });

    return () => {
      socket.emit("leave-group", id);
      socket.off("receive-message");
      socket.off("typing");
    };
  }, [socket, id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
  if (!message.trim() && !file) return;

  try {
    let sentMessage = null;

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
      sentMessage = res.data.message;

      // Emit to socket AFTER successful save
      socket.emit("sendMessage", sentMessage);

      // Also show locally (optional, since socket will do it too)
      setMessages((prev) => [...prev, sentMessage]);
    }

    setMessage("");
    setFile(null);
    setShowEmojiPicker(false);
  } catch (error) {
    console.error("Failed to send message", error);
  }
};

  const handleEdit = (msg) => {
    setMessage(msg.message);
    setEditingMsgId(msg._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/api/messages/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setMessages((prev) => prev.filter((m) => m._id !== id));
  };

  const handleTyping = () => {
    socket.emit("typing", { groupId: id, senderName: user.name });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow rounded mt-6">
      <h2 className="text-2xl font-bold mb-4">
        Group Chat: {group?.group_name || "..."}
      </h2>

      <div className="h-96 overflow-y-auto border rounded p-4 mb-4 bg-gray-50">
        {messages.map((msg) => (
          <div key={msg._id} className={`mb-3 ${msg.sender._id === user._id ? "text-right" : "text-left"}`}>
            <div className="inline-block px-3 py-2 rounded-lg bg-blue-100 text-gray-800 relative">
              <strong>{msg.sender.name}</strong>: {msg.message}
              {msg.file && (
                <div className="mt-2">
                  <a
                    href={`http://localhost:3000/${msg.file.replace("public\\", "").replace(/\\/g, "/")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    📎 Attachment
                  </a>
                </div>
              )}

              {msg.sender._id === user._id && (
                <div className="absolute top-1 right-1 space-x-1 text-xs">
                  <button onClick={() => handleEdit(msg)}>✏️</button>
                  <button onClick={() => handleDelete(msg._id)}>🗑️</button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
        {typingUser && (
          <div className="text-sm italic text-gray-500">{typingUser} is typing...</div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 relative">
          <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😊</button>
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-50">
              <EmojiPicker onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)} />
            </div>
          )}
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2"
            placeholder={editingMsgId ? "Edit message..." : "Type a message..."}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              handleTyping();
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
        </div>

        <div className="flex justify-between items-center">
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {editingMsgId ? "Update" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
