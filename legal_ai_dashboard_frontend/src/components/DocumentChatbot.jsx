import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { askDocumentBot } from "../api/api";
import Loader from "../components/Loader";

export default function DocumentChatbot({ docId, close }) {

  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  const abortRef = useRef(null);

  // =========================
  // 🔽 AUTO SCROLL
  // =========================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  // =========================
  // 💾 LOAD CHAT CACHE
  // =========================
  useEffect(() => {
    const saved = localStorage.getItem(`chat_${docId}`);
    if (saved) {
      setChat(JSON.parse(saved));
    }
  }, [docId]);

  // =========================
  // 💾 SAVE CHAT CACHE
  // =========================
  useEffect(() => {
    localStorage.setItem(`chat_${docId}`, JSON.stringify(chat));
  }, [chat, docId]);

  // =========================
  // 🤖 ASK QUESTION
  // =========================
  const ask = async () => {

    if (!question.trim() || loading) return;

    const currentQuestion = question.trim();

    const userMsg = { type: "q", text: currentQuestion };

    setChat(prev => [...prev, userMsg]);
    setQuestion("");

    try {

      setLoading(true);

      // 🔥 Cancel previous request if any
      if (abortRef.current) {
        abortRef.current.abort();
      }

      abortRef.current = new AbortController();

      const res = await askDocumentBot(docId, currentQuestion);

      const answer = res.answer || "No answer found";

      // =========================
      // 🔥 TYPING EFFECT
      // =========================
      let currentText = "";
      const botMsg = { type: "a", text: "" };

      setChat(prev => [...prev, botMsg]);

      for (let char of answer) {
        currentText += char;

        await new Promise(r => setTimeout(r, 10));

        setChat(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = currentText;
          return [...updated];
        });
      }

    } catch (err) {

      console.error(err);

      setChat(prev => [
        ...prev,
        { type: "a", text: "⚠️ Unable to fetch response. Try again." }
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

      {/* Glass Container */}
      <div className="flex flex-col h-full p-4 text-white backdrop-blur-lg">

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

            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-3 rounded-xl max-w-[80%] text-sm ${msg.type === "q"
                  ? "bg-white/20 ml-auto"
                  : "bg-white/30"
                }`}
            >
              {msg.text}
            </motion.div>

          ))}

          {/* Loader */}
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
            disabled={loading}
            className="flex-1 p-2 rounded bg-white/20 text-white placeholder-white/70 outline-none"
            placeholder="Ask about document..."
          />

          <button
            onClick={ask}
            disabled={loading}
            className={`px-4 rounded font-semibold transition ${loading
                ? "bg-gray-300 text-gray-500"
                : "bg-white text-indigo-600 hover:scale-105"
              }`}
          >
            Send
          </button>

        </div>

      </div>

    </motion.div>
  );
}