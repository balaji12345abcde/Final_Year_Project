import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { askDocumentBot } from "../api/api";
import Loader from "../components/Loader";

export default function DocumentChatbot({ docId, close }) {

  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // 🔽 Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const ask = async () => {

    if (!question.trim()) return;

    const userMsg = { type: "q", text: question };

    // ✅ Add user message immediately
    setChat((prev) => [...prev, userMsg]);

    try {

      setLoading(true);

      const currentQuestion = question;
      setQuestion("");

      const res = await askDocumentBot(docId, currentQuestion);

      const botMsg = {
        type: "a",
        text: res.answer || "No answer found"
      };

      setChat((prev) => [...prev, botMsg]);

    } catch (err) {

      console.error(err);

      setChat((prev) => [
        ...prev,
        { type: "a", text: "⚠️ Error getting response" }
      ]);

    } finally {

      setLoading(false);

    }
  };

  return (

    <motion.div
      initial={{ x: 350 }}
      animate={{ x: 0 }}
      className="fixed right-0 top-0 h-full w-96 z-50 flex flex-col shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #4f46e5, #9333ea, #ec4899)"
      }}
    >

      {/* 🌫 Glass Container */}
      <div className="glass flex flex-col h-full p-4 text-white">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">

          <h3 className="font-semibold text-lg">
            📄 Doc Assistant
          </h3>

          <button
            onClick={close}
            className="hover:bg-white/20 px-2 py-1 rounded"
          >
            ✕
          </button>

        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-1">

          {chat.length === 0 && (
            <p className="text-sm opacity-70">
              Ask questions about your document...
            </p>
          )}

          {chat.map((msg, i) => (

            <div
              key={i}
              className={`p-3 rounded-xl max-w-[80%] text-sm ${
                msg.type === "q"
                  ? "bg-white/20 ml-auto backdrop-blur"
                  : "bg-white/30 text-white"
              }`}
            >
              {msg.text}
            </div>

          ))}

          {/* 🔄 Loader */}
          {loading && (
            <div className="bg-white/30 p-3 rounded-xl w-fit">
              <Loader />
            </div>
          )}

          <div ref={chatEndRef}></div>

        </div>

        {/* Input */}
        <div className="flex gap-2">

          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            className="flex-1 p-2 rounded bg-white/20 text-white placeholder-white/70 outline-none"
            placeholder="Ask about document..."
          />

          <button
            onClick={ask}
            disabled={loading}
            className="bg-white text-indigo-600 px-4 rounded font-semibold hover:scale-105 transition"
          >
            Send
          </button>

        </div>

      </div>

    </motion.div>
  );
}