import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { getDashboard } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAnalysis } from "../context/AnalysisContext";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 🔥 Context integration
  const { loadDocument } = useAnalysis();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await getDashboard();
      setData(res);

    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");

    } finally {
      setLoading(false);
    }
  };

  // 🎨 Colors
  const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

  // 🔥 HANDLE CLICK ON HISTORY
  const handleOpenDocument = (docId) => {
    loadDocument(docId);
    navigate(`/summary/${docId}`);
  };

  return (

    <MainLayout>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        <h1 className="text-2xl font-bold mb-6">
          Dashboard
        </h1>

        {/* 🔄 Loading */}
        {loading && (
          <p className="text-gray-500">Loading dashboard...</p>
        )}

        {/* ❌ Error */}
        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {/* ✅ DATA */}
        {!loading && data && (

          <>

            {/* ================== STATS ================== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-gray-500">Uploaded Documents</h3>
                <p className="text-3xl font-bold mt-2">
                  {data.total_documents || 0}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-gray-500">Latest Type</h3>
                <p className="text-xl mt-2">
                  {data.document_type || "N/A"}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-gray-500">Risk Level</h3>
                <p className={`text-xl mt-2 font-semibold ${data.risk_level === "High"
                    ? "text-red-500"
                    : data.risk_level === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}>
                  {data.risk_level || "N/A"}
                </p>
              </div>

            </div>

            {/* ================== CHART ================== */}
            <div className="bg-white p-6 rounded-xl shadow mb-6">

              <h3 className="mb-4 font-semibold text-gray-700">
                Document Distribution
              </h3>

              {data.chart_data?.length > 0 ? (

                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>

                    <Pie
                      data={data.chart_data}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label={
                        data.chart_data.length > 1
                          ? ({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          : ({ name }) => `${name} 100%`
                      }
                      labelLine={false}
                    >
                      {data.chart_data.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip />
                    <Legend />

                  </PieChart>
                </ResponsiveContainer>

              ) : (
                <p className="text-gray-500">
                  No chart data available
                </p>
              )}

            </div>

            {/* ================== HISTORY ================== */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h3 className="mb-4 font-semibold">
                Upload History
              </h3>

              {data.history?.length > 0 ? (

                data.history.map((item, i) => (

                  <div
                    key={i}
                    onClick={() => handleOpenDocument(item.id)}
                    className="border p-3 mb-2 rounded flex justify-between cursor-pointer hover:bg-gray-100 transition"
                  >
                    <span>{item.name}</span>
                    <span className="text-gray-500 text-sm">
                      {item.date}
                    </span>
                  </div>

                ))

              ) : (
                <p className="text-gray-500">
                  No history available
                </p>
              )}

            </div>

          </>
        )}

      </motion.div>

    </MainLayout>
  );
}