import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import MainLayout from "../layout/MainLayout";
import DocumentChatbot from "../components/DocumentChatbot";
import { motion } from "framer-motion";

import { streamSummary, analyzeDocument } from "../api/api";
import { useAnalysis } from "../context/AnalysisContext";

export default function SummaryPage() {

  const { docId: paramDocId } = useParams();

  const {
    summaryChunks,
    setSummaryChunks,
    analysisData,
    setAnalysisData,
    docId,
    loadDocument
  } = useAnalysis();

  const [loading, setLoading] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {

    // =====================================
    // 🔥 LOAD DOCUMENT INTO CONTEXT
    // =====================================
    if (docId !== paramDocId) {
      loadDocument(paramDocId);
      return;
    }

    // =====================================
    // 🔥 RESET STATES WHEN NEW DOC
    // =====================================
    setIsFinished(false);

    // =====================================
    // ✅ IF DATA EXISTS → SKIP FETCH
    // =====================================
    if (summaryChunks.length > 0 && analysisData) {
      return;
    }

    setLoading(true);

    // =====================================
    // 🔥 RUN ANALYSIS (BACKGROUND)
    // =====================================
    analyzeDocument(paramDocId)
      .then((res) => {
        setAnalysisData(res);
      })
      .catch(console.error);

    // =====================================
    // 🔥 STREAM SUMMARY
    // =====================================
    const eventSource = streamSummary(paramDocId, (chunk) => {

      if (chunk === "[DONE]") {
        setIsFinished(true);
        setLoading(false);
        return;
      }

      setSummaryChunks((prev) => [...prev, chunk]);
      setLoading(false);

    }, (err) => {
      console.error("Streaming error:", err);
      setLoading(false);
    });

    return () => eventSource.close();

  }, [paramDocId, docId]);

  return (

    <MainLayout>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl"
      >

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold">
            Live Document Summary ⚡
          </h1>

          <button
            onClick={() => setChatOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Open Chatbot
          </button>

        </div>

        {/* 🔄 Loading */}
        {loading && summaryChunks.length === 0 && (
          <p className="text-gray-500 animate-pulse">
            Generating summary...
          </p>
        )}

        {/* ✅ Summary */}
        <div className="bg-white p-6 rounded shadow mb-6 min-h-[150px]">

          {/* No data */}
          {summaryChunks.length === 0 && !loading && (
            <p className="text-gray-400">
              No summary available
            </p>
          )}

          {/* 🔥 STREAMING STATUS */}
          {!isFinished && summaryChunks.length > 0 && (
            <p className="text-blue-500 mb-4 animate-pulse">
              Streaming more content...
            </p>
          )}

          {/* 🔥 SUMMARY CHUNKS */}
          {summaryChunks.map((chunk, index) => (

            <div
              key={index}
              className="mb-6 p-4 bg-gray-50 rounded-lg border-l-4 border-indigo-500"
            >

              <h4 className="text-sm text-gray-500 mb-2">
                Part {index + 1}
              </h4>

              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {chunk}
              </p>

            </div>

          ))}

          {/* ✅ DONE MESSAGE */}
          {isFinished && (
            <p className="text-green-600 font-semibold mt-4">
              ✅ Summary Complete
            </p>
          )}

        </div>

      </motion.div>

      {/* 🤖 Chatbot */}
      {chatOpen && (
        <DocumentChatbot
          docId={paramDocId}
          close={() => setChatOpen(false)}
        />
      )}

    </MainLayout>
  );
}