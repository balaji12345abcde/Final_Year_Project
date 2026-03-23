import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { analyzeDocument } from "../api/api";
import MainLayout from "../layout/MainLayout";
import DocumentChatbot from "../components/DocumentChatbot";
import { motion } from "framer-motion";
import { useAnalysis } from "../context/AnalysisContext";

export default function SummaryPage() {

  const { docId } = useParams();

  const { analysisData, setAnalysisData } = useAnalysis();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  // 🔥 Fetch ONLY if data not present OR new docId
  useEffect(() => {
    if (!analysisData || analysisData.docId !== docId) {
      fetchData();
    }
  }, [docId]);

  const fetchData = async () => {

    try {

      setLoading(true);
      setError("");

      const res = await analyzeDocument(docId);

      // 🔥 Save full data globally
      setAnalysisData({
        ...res,
        docId
      });

    } catch (err) {

      console.error(err);
      setError("Failed to load summary");

    } finally {

      setLoading(false);
    }
  };

  const summary = analysisData?.summary;

  return (

    <MainLayout>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl"
      >

        {/* Header */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-2xl font-bold mb-6">
            Document Summary
          </h1>

          <button
            onClick={() => setChatOpen(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Open Chatbot
          </button>

        </div>

        {/* 🔄 Loading */}
        {loading && (
          <div className="space-y-4">
            <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-40 bg-gray-200 animate-pulse rounded"></div>
          </div>
        )}

        {/* ❌ Error */}
        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {/* ✅ Summary */}
        {summary && !loading && (

          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-white p-6 rounded shadow"
          >

            <h3 className="font-semibold mb-4 text-lg">
              Summary
            </h3>

            {Object.keys(summary).length > 0 ? (

              Object.entries(summary).map(([key, value], i) => (

                <div key={i} className="mb-4">

                  <h4 className="text-blue-600 font-semibold">
                    {key}
                  </h4>

                  <p className="text-gray-700 leading-relaxed">
                    {value}
                  </p>

                </div>

              ))

            ) : (

              <p className="text-gray-500">
                No summary available
              </p>

            )}

          </motion.div>

        )}

      </motion.div>

      {/* 🤖 Chatbot */}
      {chatOpen && (
        <DocumentChatbot
          docId={docId}
          close={() => setChatOpen(false)}
        />
      )}

    </MainLayout>
  );
}