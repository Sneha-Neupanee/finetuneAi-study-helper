import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { role: "user", text: message };
    setChat((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message,
      });

      const botMsg = { role: "bot", text: res.data.reply };

      setChat((prev) => [...prev, botMsg]);
      setMessage("");
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: "Server error. Try again." },
      ]);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🧠 FineTuneAI Coach</h2>

      <div style={styles.chatBox}>
        {chat.map((c, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: c.role === "user" ? "flex-end" : "flex-start",
              backgroundColor: c.role === "user" ? "#DCF8C6" : "#eee",
            }}
          >
            {c.text}
          </div>
        ))}
      </div>

      <div style={styles.inputBox}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Arial",
  },
  chatBox: {
    width: "60%",
    height: "70vh",
    border: "1px solid #ccc",
    padding: "10px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    padding: "10px",
    borderRadius: "10px",
    maxWidth: "70%",
  },
  inputBox: {
    display: "flex",
    width: "60%",
    marginTop: "10px",
  },
  input: {
    flex: 1,
    padding: "10px",
  },
  button: {
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default App;