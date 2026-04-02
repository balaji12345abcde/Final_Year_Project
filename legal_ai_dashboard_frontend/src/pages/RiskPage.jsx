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

  useEffect(() => {

    // 🔥 Load correct document into context
    if (!docId) {
      const savedDoc = localStorage.getItem("docId");
      if (savedDoc) {
        loadDocument(savedDoc);
      }
      return;
    }

    // ✅ If already exists → don't fetch again
    if (analysisData) return;

    setLoading(true);

    analyzeDocument(docId)
      .then((res) => {
        setAnalysisData(res);
      })
      .catch((err) => {
        console.error("Risk fetch error:", err);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [docId]);

  // 🔥 Safe fallback
  const riskScore = analysisData?.risk_score || 0;
  const risk = Math.min(riskScore * 10, 100);

  const chartData = [
    { name: "Risk", value: risk },
    { name: "Safe", value: 100 - risk }
  ];

  const COLORS = ["#ef4444", "#22c55e"];

  return (

    <MainLayout>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >

        {/* 🔥 Title */}
        <h1 className="text-2xl font-bold mb-6">
          Risk Analysis
        </h1>

        {/* 🔄 Loading */}
        {loading && (
          <p className="text-gray-500">Loading risk analysis...</p>
        )}

        {/* ✅ DATA */}
        {!loading && analysisData && (

          <>
            {/* ================== TOP CARD ================== */}
            <div className="bg-white p-6 rounded-xl shadow mb-6 text-center">

              <p className="text-gray-500 text-sm">
                Risk Score
              </p>

              <h2 className="text-4xl font-bold mt-2 text-red-500">
                {risk}%
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                {risk > 70
                  ? "High Risk Document ⚠️"
                  : risk > 40
                    ? "Moderate Risk ⚡"
                    : "Low Risk ✅"}
              </p>

            </div>

            {/* ================== CHART ================== */}
            <div className="bg-white p-6 rounded-xl shadow flex justify-center">

              <div className="w-[320px] h-[320px] relative">

                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>

                    <Pie
                      data={chartData}
                      dataKey="value"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>

                    <Tooltip />

                  </PieChart>
                </ResponsiveContainer>

                {/* 🔥 CENTER TEXT */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">

                  <span className="text-3xl font-bold text-red-500">
                    {risk}%
                  </span>

                  <span className="text-sm text-gray-500">
                    Risk Level
                  </span>

                </div>

              </div>

            </div>

          </>
        )}

        {/* ❌ No Data */}
        {!loading && !analysisData && (

          <p className="text-gray-500">
            No data available. Upload and analyze a document first.
          </p>

        )}

      </motion.div>

    </MainLayout>
  );
}