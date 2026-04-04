import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { motion } from "framer-motion";
import { useAnalysis } from "../context/AnalysisContext";
import { analyzeDocument } from "../api/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function RiskPage() {

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

    // 🔥 CACHE
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
      .catch(() => setError("Failed to load risk data"))
      .finally(() => setLoading(false));

  }, [docId]);

  const riskScore = analysisData?.risk_score || 0;
  const risk = Math.min(riskScore * 10, 100);
  const riskLevel = analysisData?.risk_level || "Unknown";
  const riskFactors = analysisData?.risk_factors || [];

  const chartData = [
    { name: "Risk", value: risk },
    { name: "Safe", value: 100 - risk }
  ];

  const getColor = () => {
    if (riskLevel === "High Risk") return "#ef4444";
    if (riskLevel === "Medium Risk") return "#f59e0b";
    return "#22c55e";
  };

  const COLORS = [getColor(), "#e5e7eb"];

  return (
    <MainLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        <h1 className="text-2xl font-bold mb-6">⚠️ Risk Analysis</h1>

        {loading && (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-20 bg-white/20 animate-pulse rounded-xl"></div>
            ))}
          </div>
        )}

        {error && <p className="text-red-400">{error}</p>}

        {!loading && analysisData && (

          <>
            {/* TOP */}
            <div className="bg-white p-6 rounded-xl shadow mb-6 text-center">

              <h2 className="text-4xl font-bold" style={{ color: getColor() }}>
                {risk}%
              </h2>

              <p className="mt-2 font-medium">{riskLevel}</p>

            </div>

            {/* CHART */}
            <div className="bg-white p-6 rounded-xl shadow mb-6 flex justify-center">

              <div className="w-[300px] h-[300px] relative">

                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      innerRadius={70}
                      outerRadius={100}
                    >
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">{risk}%</span>
                  <span className="text-sm text-gray-500">Risk</span>
                </div>

              </div>

            </div>

            {/* FACTORS */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h3 className="font-semibold mb-4">Risk Factors</h3>

              {riskFactors.length > 0 ? (

                <ul className="space-y-2">
                  {riskFactors.map((f, i) => (
                    <li key={i} className="bg-red-50 p-3 rounded text-sm">
                      {f}
                    </li>
                  ))}
                </ul>

              ) : (
                <p className="text-gray-500">
                  No major risk factors
                </p>
              )}

            </div>

          </>
        )}

      </motion.div>
    </MainLayout>
  );
}