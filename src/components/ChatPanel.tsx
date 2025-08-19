import axios from "axios";
import { useState } from "react";

export default function ChatPanel({ docId }: { docId: string | null }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!docId || !input) return;
    const res = await axios.post("http://localhost:5000/chat", {
      docId,
      question: input
    });
    setMessages([...messages, { role: "user", text: input }, res.data]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <b>{m.role === "user" ? "You:" : "AI:"}</b> {m.text || m.answer}
          </div>
        ))}
      </div>
      <div className="p-2 border-t">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border p-2 w-3/4"
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-2 ml-2">
          Send
        </button>
      </div>
    </div>
  );
}
