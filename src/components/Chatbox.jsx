import React, { useState } from "react";
import axios from "axios";

const Chatbox = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input) return;

    const newMessage = { type: "user", text: input };
    setMessages([...messages, newMessage]);

    const res = await axios.post("http://localhost:5000/chatbox", { message: input });
    setMessages(prev => [...prev, { type: "bot", text: res.data.response }]);
    setInput("");
  };

  return (
    <div style={chatStyle}>
      <h3>💬 Chat with SuperBot</h3>
      <div style={msgContainer}>
        {messages.map((msg, i) => (
          <div key={i} style={msg.type === "user" ? userMsg : botMsg}>
            {msg.text}
          </div>
        ))}
      </div>
      <div style={inputRow}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          style={inputStyle}
          placeholder="Ask something..."
        />
        <button onClick={sendMessage} style={btnStyle}>Send</button>
      </div>
    </div>
  );
};

const chatStyle = { maxWidth: 400, margin: "auto", padding: 20, borderRadius: 10, background: "#f1f1f1" };
const msgContainer = { maxHeight: 300, overflowY: "auto", marginBottom: 10 };
const inputRow = { display: "flex", gap: 10 };
const inputStyle = { flex: 1, padding: 10, borderRadius: 5, border: "1px solid #ccc" };
const btnStyle = { padding: "10px 15px", borderRadius: 5, background: "#4caf50", color: "#fff", border: "none" };
const userMsg = { textAlign: "right", margin: "5px 0", padding: 10, background: "#d1e7dd", borderRadius: 10 };
const botMsg = { textAlign: "left", margin: "5px 0", padding: 10, background: "#f8d7da", borderRadius: 10 };

export default Chatbox;
