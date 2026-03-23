import { useState, useRef, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import { askLegalBot } from "../api/api";
import { motion } from "framer-motion";

export default function ChatbotPage() {

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

    setChat((prev) => [...prev, userMsg]);

    try {

      setLoading(true);

      const currentQuestion = question;
      setQuestion("");

      const res = await askLegalBot(currentQuestion);

      const botMsg = {
        type: "a",
        text: res.answer || "No answer available"
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

    <MainLayout>

      {/* 🌈 Background */}
      <div className="bg-main  p-6 text-white">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >

          <h1 className="text-2xl font-bold mb-6">
            ⚖ Legal Chatbot
          </h1>

          {/* 💬 Chat Container */}
          <div className="glass p-6 shadow-xl h-[65vh] flex flex-col">

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2">

              {chat.length === 0 && (
                <p className="text-sm opacity-70">
                  Ask any legal question...
                </p>
              )}

              {chat.map((msg, i) => (

                <div
                  key={i}
                  className={`flex ${
                    msg.type === "q"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >

                  <div
                    className={`px-4 py-2 rounded-xl max-w-xs text-sm ${
                      msg.type === "q"
                        ? "bg-white/20 backdrop-blur"
                        : "bg-white/30 text-white"
                    }`}
                  >
                    {msg.text}
                  </div>

                </div>

              ))}

              {/* 🔄 Loader */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/30 px-4 py-2 rounded-xl flex gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef}></div>

            </div>

            {/* ✍ Input */}
            <div className="flex gap-2">

              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && ask()}
                className="flex-1 p-2 rounded bg-white/20 text-white placeholder-white/70 outline-none"
                placeholder="Ask legal question..."
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

      </div>

    </MainLayout>

  );
}