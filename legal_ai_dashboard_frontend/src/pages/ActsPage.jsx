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
  const [error, setError] = useState("");

  useEffect(() => {

    if (!docId) {
      const saved = localStorage.getItem("docId");
      if (saved) loadDocument(saved);
      return;
    }

    const cached = localStorage.getItem(`analysis_${docId}`);
    if (cached) {
      setAnalysisData(JSON.parse(cached));
      return;
    }

    if (analysisData) return;

    setLoading(true);

    analyzeDocument(docId)
      .then(res => {
        setAnalysisData(res);
        localStorage.setItem(`analysis_${docId}`, JSON.stringify(res));
      })
      .catch(() => setError("Failed to load acts"))
      .finally(() => setLoading(false));

  }, [docId]);

  const acts = analysisData?.acts || [];

  return (
    <MainLayout>
      <div className="p-6 text-white">

        <h1 className="text-2xl font-bold mb-6">⚖️ Acts & Sections</h1>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-white/20 animate-pulse rounded-xl"></div>
            ))}
          </div>
        )}

        {error && <p className="text-red-400">{error}</p>}

        {!loading && acts.length > 0 && (
          <div className="space-y-4">

            {acts.map((a, i) => (

              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/90 p-5 rounded-xl text-black"
              >

                <h3 className="font-semibold">
                  {a.act} - Section {a.section}
                </h3>

                <p className="mt-2 text-sm">{a.description}</p>

                {a.reason && (
                  <p className="mt-2 text-xs text-gray-600">
                    Reason: {a.reason}
                  </p>
                )}

                {a.confidence && (
                  <p className="mt-1 text-xs font-semibold text-indigo-600">
                    Confidence: {(a.confidence * 100).toFixed(1)}%
                  </p>
                )}

              </motion.div>

            ))}

          </div>
        )}

        {!loading && acts.length === 0 && (
          <div className="bg-white/20 p-6 rounded-xl text-center">
            No acts detected
          </div>
        )}

      </div>
    </MainLayout>
  );
}