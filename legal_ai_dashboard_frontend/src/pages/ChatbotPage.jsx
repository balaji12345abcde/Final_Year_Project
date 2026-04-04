import { useState, useRef, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import { askLegalBot } from "../api/api";
import { motion } from "framer-motion";

export default function ChatbotPage() {

  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  // 🔥 LOAD CACHE
  useEffect(() => {
    const saved = localStorage.getItem("general_chat");
    if (saved) setChat(JSON.parse(saved));
  }, []);

  // 🔥 SAVE CACHE
  useEffect(() => {
    localStorage.setItem("general_chat", JSON.stringify(chat));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const ask = async () => {

    if (!question.trim() || loading) return;

    const q = question.trim();

    setChat(prev => [...prev, { type: "q", text: q }]);
    setQuestion("");

    try {

      setLoading(true);

      const res = await askLegalBot(q);
      const answer = res.answer || "No answer available";

      // 🔥 typing effect
      let text = "";

      setChat(prev => [...prev, { type: "a", text: "" }]);

      for (let char of answer) {
        text += char;

        await new Promise(r => setTimeout(r, 10));

        setChat(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = text;
          return [...updated];
        });
      }

    } catch (err) {

      setChat(prev => [
        ...prev,
        { type: "a", text: "⚠️ Error getting response" }
      ]);

    } finally {
      setLoading(false);
    }
  };

  return (

    <MainLayout>

      <div className="p-6 text-white">

        <h1 className="text-2xl font-bold mb-6">
          ⚖️ Legal Chatbot
        </h1>

        <div className="bg-white/20 p-6 rounded-xl h-[65vh] flex flex-col">

          {/* CHAT */}
          <div className="flex-1 overflow-y-auto space-y-3">

            {chat.length === 0 && (
              <p className="opacity-70">
                Ask any legal question...
              </p>
            )}

            {chat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.type === "q" ? "justify-end" : "justify-start"
                  }`}
              >
                <div className="bg-white/30 px-4 py-2 rounded-xl max-w-xs">
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <p className="text-sm opacity-70">Typing...</p>
            )}

            <div ref={chatEndRef}></div>

          </div>

          {/* INPUT */}
          <div className="flex gap-2 mt-3">

            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              className="flex-1 p-2 rounded bg-white/20"
              placeholder="Ask legal question..."
            />

            <button
              onClick={ask}
              disabled={loading}
              className="bg-white text-black px-4 rounded"
            >
              Send
            </button>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}