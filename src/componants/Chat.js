import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import Header from "../Header";
import Backbtn from "./minicomp/Backbtn";
import { useNavigate } from 'react-router-dom';

const ENDPOINT = "http://localhost:5000";

function Chat() {
  const { isLoggedIn } = useAuth(); // Access authentication status
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login if not logged in
    }
  }, [isLoggedIn, navigate]);

  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [chatId, setChatId] = useState("");
  const [socket, setSocket] = useState(null);
  const selectedUserId = localStorage.getItem("user2Id");
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const newSocket = io(ENDPOINT, { transports: ["websocket"] });
    setSocket(newSocket);
    newSocket.emit("setup", { _id: currentUserId });
    newSocket.on("messageReceived", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });
    return () => {
      newSocket.disconnect();
    };
  }, [currentUserId]);

  useEffect(() => {
    const fetchChatId = async () => {
      if (!selectedUserId) return;
      const token = localStorage.getItem("token");
      try {
        const response = await axios.post(
          "http://localhost:5000/api/chat",
          { currentUserId, selectedUserId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data) setChatId(response.data.chatId);
      } catch (error) {
        console.error("Error accessing or creating chat:", error);
      }
    };
    fetchChatId();
  }, [selectedUserId, currentUserId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `http://localhost:5000/api/message/${chatId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [chatId, messages]);

  const sendMessage = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        "http://localhost:5000/api/message",
        { chatId, content: messageContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      socket.emit("sendMessage", {
        chat: { _id: chatId, users: [currentUserId, selectedUserId] },
        content: messageContent,
        sender: { _id: currentUserId, name: localStorage.getItem("name") },
      });
      setMessageContent("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div>
      <Header />
      <div
        className="chat-container"
        style={{
          maxWidth: "920px",
          margin: "0 auto",
          padding: "18px",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 15px",
            backgroundColor: "#f1f1f1",
            borderBottom: "1px solid #ddd",
          }}
        >
          <Backbtn />
          <h4
            style={{
              margin: "0",
              fontSize: "18px",
              textAlign: "center",
            }}
          >
            Chat
          </h4>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "16px",
              color: "black",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5" />
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            </svg>
            {localStorage.getItem("user2name")}
          </span>
        </div>

        {/* Message List */}
        <div
          style={{
            height: "360px",
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          {messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                display: "flex",
                justifyContent:
                  msg.sender._id === currentUserId ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  backgroundColor:
                    msg.sender._id === currentUserId ? "#dcf8c6" : "#fff",
                  padding: "10px",
                  borderRadius: "10px",
                  maxWidth: "60%",
                  wordBreak: "break-word",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px",
            borderTop: "1px solid #ddd",
            backgroundColor: "#f9f9f9",
          }}
        >
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type a message"
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              marginRight: "10px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "10px 15px",
              borderRadius: "5px",
              border: "none",
              backgroundColor: "#007bff",
              color: "#fff",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
