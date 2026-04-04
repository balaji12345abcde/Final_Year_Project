import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import MainLayout from "../layout/MainLayout";
import DocumentChatbot from "../components/DocumentChatbot";
import { motion } from "framer-motion";

import {
  translateSummary,
  streamSummary,
  analyzeDocument,
  getAnalysis
} from "../api/api";

import { useAnalysis } from "../context/AnalysisContext";

export default function SummaryPage() {

  const { docId: paramDocId } = useParams();

  const {
    summaryData,
    setSummaryData,
    docId,
    loadDocument
  } = useAnalysis();

  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const [translatedChunks, setTranslatedChunks] = useState([]);
  const [selectedLang, setSelectedLang] = useState("");
  const [translating, setTranslating] = useState(false);

  const eventSourceRef = useRef(null);

  // =========================
  // 🔥 STREAM HANDLER
  // =========================
  const handleStreamChunk = (chunk) => {

    if (chunk === "[DONE]") {

      setSummaryData(prev => ({
        ...prev,
        isFinished: true
      }));

      setLoading(false);
      eventSourceRef.current?.close();
      return;
    }

    setSummaryData(prev => {

      if (prev.chunks.includes(chunk)) return prev;

      return {
        ...prev,
        chunks: [...prev.chunks, chunk]
      };
    });
  };

  const handleTranslate = async (lang) => {

    setSelectedLang(lang);

    if (!lang) {
      setTranslatedChunks([]);
      return;
    }

    setTranslating(true);

    try {
      const fullText = summaryData.chunks.join(" ");

      // ✅ FIX: pass docId
      const res = await translateSummary(fullText, lang, paramDocId);

      setTranslatedChunks(res.translated_text.split(". "));
    } catch (err) {
      console.error(err);
    }

    setTranslating(false);
  };
  useEffect(() => {
    setTranslatedChunks([]);
  }, [paramDocId]);
  // =========================
  // 🔥 MAIN LOGIC (FIXED)
  // =========================
  useEffect(() => {

    if (!paramDocId) return;

    // 🔄 load context
    if (docId !== paramDocId) {
      loadDocument(paramDocId);
    }

    // 🔥 STEP 1: Try DB FIRST
    const fetchSaved = async () => {

      try {
        const res = await getAnalysis(paramDocId);

        if (res.summary) {
          setSummaryData({
            chunks: [res.summary],
            isFinished: true
          });

          return true; // already done
        }

      } catch (err) {
        console.log("No saved data, generating...");
      }

      return false;
    };

    const init = async () => {

      setLoading(true);

      const exists = await fetchSaved();

      if (exists) {
        setLoading(false);
        return;
      }

      // 🔥 STEP 2: RUN ANALYSIS
      await analyzeDocument(paramDocId);

      // 🔥 STEP 3: START STREAM (UI only)
      eventSourceRef.current = streamSummary(
        paramDocId,
        handleStreamChunk,
        () => setLoading(false)
      );
    };

    init();

    return () => {
      eventSourceRef.current?.close();
    };

  }, [paramDocId]);

  // =========================
  // 🔥 DISPLAY DATA
  // =========================
  const displayData =
    translatedChunks.length > 0
      ? translatedChunks
      : summaryData.chunks;

  const sentences = displayData
    .join(" ")
    .split(". ")
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i);

  // =========================
  // UI
  // =========================
  return (

    <MainLayout>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl mx-auto"
      >

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold text-white">
            ⚡ AI Legal Summary
          </h1>

          <div className="flex gap-3">

            <button
              onClick={() => setChatOpen(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              🤖 Chat
            </button>

            <select
              value={selectedLang}
              onChange={(e) => handleTranslate(e.target.value)}
              className="px-3 py-2 rounded-lg"
            >
              <option value="">🌐 English</option>
              <option value="ta">Tamil</option>
              <option value="hi">Hindi</option>
              <option value="fr">French</option>
            </select>

          </div>

        </div>

        {/* LOADING */}
        {loading && summaryData.chunks.length === 0 && (
          <p className="text-white animate-pulse">
            ⚡ Analyzing your document...
          </p>
        )}

        {/* TRANSLATION LOADING */}
        {translating && (
          <p className="text-blue-400 mb-2">
            🌐 Translating...
          </p>
        )}

        {/* MAIN CARD */}
        <div className="bg-white/90 p-8 rounded-2xl shadow-xl">

          {!summaryData.isFinished && summaryData.chunks.length > 0 && (
            <p className="text-blue-500 mb-4 animate-pulse">
              ⚡ Generating insights...
            </p>
          )}

          <div className="text-gray-800 text-[17px] leading-loose">

            {sentences.map((line, i) => (
              <motion.p key={i} className="mb-3">
                {line}.
              </motion.p>
            ))}

          </div>

          {summaryData.isFinished && (
            <div className="mt-6 text-green-600 font-semibold">
              ✅ Summary Complete
            </div>
          )}

        </div>

      </motion.div>

      {chatOpen && (
        <DocumentChatbot
          docId={paramDocId}
          close={() => setChatOpen(false)}
        />
      )}

    </MainLayout>
  );
}