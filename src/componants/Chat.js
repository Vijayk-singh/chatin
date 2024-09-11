import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client"; // Import Socket.IO
import Header from "../Header";
import Backbtn from "./minicomp/Backbtn";

const ENDPOINT = "http://localhost:5000";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [chatId, setChatId] = useState("");
  const [socket, setSocket] = useState(null); // Add socket state
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
      newSocket.disconnect(); // Cleanup socket connection when unmounting
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
            alignItems: "center", // Align items centrally
            padding: "10px 15px", // Adjusted padding to fit nicely
            backgroundColor: "#f1f1f1",
            borderBottom: "1px solid #ddd",
            // height: "60px", // Reduced height
          }}
        >
          {/* Back button */}
          <Backbtn />

          {/* Center Title */}
          <h4
            style={{
              margin: "0",
              fontSize: "18px",
              textAlign: "center", // Center-align the text
            }}
          >
            Chat
          </h4>

          {/* Right-side icon with username */}
          <span
            style={{
              display: "flex",
              alignItems: "center", // Align text with the icon
              gap: "10px",
              fontSize: "16px", // Font size smaller
              color: "black",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25" // Reduced size of icon
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
            height: "360px", // Adjusted height for scrolling
            overflowY: "scroll",
            border: "1px solid #ccc",
            padding: "10px", // Consistent padding
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
              {/* Message Layout */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px", // Space between image and text
                  maxWidth: "60%", // Ensure messages don't go too wide
                  padding: "10px",
                  backgroundColor:
                    msg.sender._id === currentUserId ? "#d1f7d6" : "#f1f0f0",
                  borderRadius: "8px",
                }}
              >
                {/* Profile Picture */}
                <img
                  src="https://via.placeholder.com/40"
                  alt="Profile"
                  style={{
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                  }}
                />

                {/* Message Content */}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {/* Username and Email */}
                  <div style={{ marginBottom: "5px" }}>
                    <strong style={{fontSize:"12px", fontWeight:'100', color:"#342df2",fontFamily: 'circular'}}>{msg.sender.name}</strong>{" "}
                    <span style={{ fontSize: "10px", color: "#888" }}>
                      {msg.sender.email}
                    </span>
                  </div>

                  {/* Message */}
                  <p style={{ margin: 0 }}>{msg.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Message Input */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <input
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginRight: "10px",
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              padding: "5px 15px",
              borderRadius: "5px",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            <img
              src="https://img.icons8.com/?size=30&id=60700&format=png&color=000000"
              alt="send"
              style={{ width: "25px", height: "25px" ,display:"flex"}} // Adjusted size of the send icon
            />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
