import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

const ChatWrapper = styled.div`
  max-width: 500px;
  margin: 60px auto;
  background-color: #121212;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
`;

const MessageList = styled.div`
  height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const Message = styled.div`
  background-color: ${(props) => (props.sender === "bot" ? "#1e40af" : "#2563eb")};
  color: white;
  padding: 10px 14px;
  margin: 8px 0;
  border-radius: 8px;
  max-width: 80%;
  align-self: ${(props) => (props.sender === "bot" ? "flex-start" : "flex-end")};
`;

const InputWrapper = styled.form`
  display: flex;
  gap: 8px;
`;

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    socket.on("bot_reply", (data) => {
      setMessages((prev) => [...prev, { sender: "bot", text: data.answer }]);
    });

    return () => socket.off("bot_reply");
  }, [navigate]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    socket.emit("user_message", { question: input });
    setInput("");
  };

  return (
    <ChatWrapper>
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>Legal Assistant</h2>
      <MessageList>
        {messages.map((msg, idx) => (
          <Message key={idx} sender={msg.sender}>
            {msg.text}
          </Message>
        ))}
      </MessageList>
      <InputWrapper onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Ask your legal question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit">Send</button>
      </InputWrapper>
    </ChatWrapper>
  );
};

export default Chat;