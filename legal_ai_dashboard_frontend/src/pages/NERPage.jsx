import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { motion } from "framer-motion";
import { useAnalysis } from "../context/AnalysisContext";
import { analyzeDocument } from "../api/api";

export default function NERPage() {

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

    // 🔥 CACHE CHECK
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
      .catch(() => setError("Failed to load entities"))
      .finally(() => setLoading(false));

  }, [docId]);

  const entities = analysisData?.entities || [];

  const grouped = {};
  entities.forEach(e => {
    if (!grouped[e.label]) grouped[e.label] = [];
    grouped[e.label].push(e.text);
  });

  Object.keys(grouped).forEach(key => {
    grouped[key] = [...new Set(grouped[key])];
  });

  const colorMap = {
    PERSON: "bg-blue-100 text-blue-700",
    ORG: "bg-green-100 text-green-700",
    GPE: "bg-yellow-100 text-yellow-700",
    DATE: "bg-pink-100 text-pink-700"
  };

  return (
    <MainLayout>
      <div className="p-6 text-white">

        <h1 className="text-2xl font-bold mb-6">🧠 Named Entities</h1>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-white/20 animate-pulse rounded-xl"></div>
            ))}
          </div>
        )}

        {error && <p className="text-red-400">{error}</p>}

        {!loading && entities.length > 0 && (
          <div className="space-y-6">

            {Object.entries(grouped).map(([type, values]) => (

              <motion.div
                key={type}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/90 p-5 rounded-xl text-black"
              >

                <h3 className="font-semibold mb-3">
                  {type} ({values.length})
                </h3>

                <div className="flex flex-wrap gap-3">

                  {values.map((val, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`px-3 py-1 rounded-full text-sm ${colorMap[type]}`}
                    >
                      {val}
                    </motion.span>
                  ))}

                </div>

              </motion.div>

            ))}

          </div>
        )}

        {!loading && entities.length === 0 && (
          <div className="bg-white/20 p-6 rounded-xl text-center">
            No entities found
          </div>
        )}

      </div>
    </MainLayout>
  );
}