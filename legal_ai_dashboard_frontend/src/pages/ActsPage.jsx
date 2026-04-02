import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { motion } from "framer-motion";
import { useAnalysis } from "../context/AnalysisContext";
import { analyzeDocument } from "../api/api";

export default function ActsPage() {

  const {
    analysisData,
    setAnalysisData,
    docId,
    loadDocument
  } = useAnalysis();

  const [loading, setLoading] = useState(false);

  useEffect(() => {

    // 🔥 Load document into context (important for refresh)
    if (!docId) {
      const savedDoc = localStorage.getItem("docId");
      if (savedDoc) {
        loadDocument(savedDoc);
      }
      return;
    }

    // ✅ If already exists → skip API call
    if (analysisData) return;

    setLoading(true);

    analyzeDocument(docId)
      .then((res) => {
        setAnalysisData(res);
      })
      .catch((err) => {
        console.error("Acts fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [docId]);

  const acts = analysisData?.acts || [];

  return (

    <MainLayout>

      <div className="bg-main min-h-screen p-6 text-white">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >

          {/* Title */}
          <h1 className="text-2xl font-bold mb-6">
            Acts & Sections
          </h1>

          {/* 🔄 Loading */}
          {loading && (
            <p className="opacity-80">Loading acts...</p>
          )}

          {/* ✅ Acts */}
          {!loading && acts.length > 0 && (

            <div className="space-y-4">

              {acts.map((a, i) => (

                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-5 shadow-lg hover:scale-[1.02] transition"
                >

                  <h3 className="font-semibold text-lg">
                    {a.act} - Section {a.section}
                  </h3>

                  {a.description && (
                    <p className="mt-2 text-sm">
                      {a.description}
                    </p>
                  )}

                  {a.reason && (
                    <p className="mt-2 text-xs opacity-90">
                      Reason: {a.reason}
                    </p>
                  )}

                  {a.confidence && (
                    <p className="mt-1 text-xs text-white-700 font-semibold">
                      Confidence: {(a.confidence * 100).toFixed(2)}%
                    </p>
                  )}

                </motion.div>

              ))}

            </div>

          )}

          {/* ❌ No Data */}
          {!loading && acts.length === 0 && (

            <div className="glass p-6 text-center opacity-80">
              No acts detected. Upload and analyze a document first.
            </div>

          )}

        </motion.div>

      </div>

    </MainLayout>
  );
}