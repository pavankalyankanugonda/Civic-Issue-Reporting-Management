import React, { useState } from "react";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Hi! Tell me your civic issue." }
  ]);

  const getBotReply = (msg) => {
    const text = msg.toLowerCase();

    const answers = [
      { keys: ["road", "pothole"], reply: "🛣️ Road issue detected. Raise complaint under Road Maintenance." },
      { keys: ["garbage", "waste"], reply: "🗑️ Garbage issue. Municipality Helpline: 1800-123-456" },
      { keys: ["water", "leak"], reply: "🚰 Water issue. Contact Water Board or raise complaint." },
      { keys: ["electricity", "power"], reply: "⚡ Power issue. Helpline: 1912" },
      { keys: ["street light"], reply: "💡 Street light not working. Raise Electricity complaint." },
      { keys: ["drain", "sewage"], reply: "🚽 Drainage issue detected. Raise Drainage complaint." },
      { keys: ["emergency"], reply: "📞 Emergency: 112 | Police:100 | Fire:101 | Ambulance:108" },
      { keys: ["complaint", "report"], reply: "📝 Go to Report Issue page to submit complaint." },
      { keys: ["hi", "hello"], reply: "👋 Hello! How can I help?" },
      { keys: ["thank"], reply: "😊 You're welcome!" }
    ];

    for (let a of answers) {
      for (let k of a.keys) {
        if (text.includes(k)) return a.reply;
      }
    }

    return (
      "🤖 I can help with:\n" +
      "• Road\n• Garbage\n• Water\n• Electricity\n• Drainage\n\n" +
      "👉 Please describe your issue clearly."
    );
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    const botMsg = { from: "bot", text: getBotReply(input) };

    setMessages([...messages, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* CHAT BUTTON */}
      <div style={styles.chatButton} onClick={() => setOpen(!open)}>
        💬
      </div>

      {/* CHAT WINDOW */}
      {open && (
        <div style={styles.chatBox}>
          <div style={styles.header}>
            Civic Chatbot
            <span style={styles.close} onClick={() => setOpen(false)}>✖</span>
          </div>

          <div style={styles.body}>
            {messages.map((m, i) => (
              <div key={i} style={m.from === "user" ? styles.userMsg : styles.botMsg}>
                {m.text}
              </div>
            ))}
          </div>

          <div style={styles.footer}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your issue..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button style={styles.sendBtn} onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
};

/* ================= STYLES ================= */
const styles = {
  chatButton: {
    position: "fixed",
    bottom: "25px",
    right: "25px",
    background: "#6366f1",
    color: "white",
    padding: "15px",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "22px",
    zIndex: 1000
  },
  chatBox: {
    position: "fixed",
    bottom: "90px",
    right: "25px",
    width: "320px",
    height: "420px",
    background: "#0f172a",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    zIndex: 1000
  },
  header: {
    padding: "12px",
    background: "#6366f1",
    color: "white",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "space-between"
  },
  close: {
    cursor: "pointer"
  },
  body: {
    flex: 1,
    padding: "10px",
    overflowY: "auto"
  },
  botMsg: {
    background: "#1e293b",
    color: "white",
    padding: "8px",
    borderRadius: "8px",
    marginBottom: "8px",
    maxWidth: "85%"
  },
  userMsg: {
    background: "#4f46e5",
    color: "white",
    padding: "8px",
    borderRadius: "8px",
    marginBottom: "8px",
    marginLeft: "auto",
    maxWidth: "85%"
  },
  footer: {
    display: "flex",
    padding: "10px"
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    outline: "none"
  },
  sendBtn: {
    marginLeft: "5px",
    background: "#22c55e",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 12px",
    cursor: "pointer"
  }
};

export default Chatbot;