import { useState } from "react";
import axios from "axios";

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    const res = await axios.post("http://localhost:5000/chat", {
      message
    });

    setChat([...chat, 
      { role: "user", text: message },
      { role: "bot", text: res.data.reply }
    ]);

    setMessage("");
  };

  return (
    <div>
      <h1>FineTuneAI Chatbot</h1>

      <div>
        {chat.map((c, i) => (
          <p key={i}>
            <b>{c.role}:</b> {c.text}
          </p>
        ))}
      </div>

      <input 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;