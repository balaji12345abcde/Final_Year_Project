import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { getDashboard, deleteDocument } from "../api/api";
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
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { loadDocument } = useAnalysis();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getDashboard();
      setData(res);

    } catch (err) {
      console.error(err);
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // 📂 OPEN DOCUMENT
  // =========================
  const handleOpen = (id) => {
    if (!id) return alert("Invalid document");

    loadDocument(id);
    navigate(`/summary/${id}`);
  };

  // =========================
  // 🗑️ DELETE
  // =========================
  const handleDelete = async (id) => {

    if (!id) return;

    if (!window.confirm("Delete this document?")) return;

    try {
      setDeletingId(id);

      await deleteDocument(id);

      // 🔥 FULL STATE UPDATE
      setData(prev => {

        const updatedHistory = prev.history.filter(item => item.id !== id);

        return {
          ...prev,
          history: updatedHistory,
          total_documents: prev.total_documents - 1
        };
      });

    } catch (err) {
      console.error(err);
      alert("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  // 🔥 dynamic colors
  const COLORS = [
    "#6366f1", "#22c55e", "#f59e0b",
    "#ef4444", "#14b8a6", "#a855f7",
    "#f97316", "#0ea5e9"
  ];

  return (

    <MainLayout>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        <h1 className="text-2xl font-bold mb-6 text-white">
          📊 Dashboard
        </h1>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="grid grid-cols-3 gap-6 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white/20 h-24 rounded-xl animate-pulse"></div>
            ))}
          </div>
        )}

        {/* ================= ERROR ================= */}
        {error && (
          <p className="text-red-400">{error}</p>
        )}

        {!loading && data && (

          <>

            {/* ================= STATS ================= */}
            <div className="grid grid-cols-3 gap-6 mb-6">

              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-gray-500 text-sm">Documents</p>
                <p className="text-2xl font-bold">
                  {data.total_documents}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-gray-500 text-sm">Latest Type</p>
                <p className="text-lg font-medium">
                  {data.document_type || "N/A"}
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow text-center">
                <p className="text-gray-500 text-sm">Risk Level</p>
                <p className={`text-lg font-semibold ${data.risk_level === "High Risk"
                    ? "text-red-500"
                    : data.risk_level === "Medium Risk"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}>
                  {data.risk_level || "N/A"}
                </p>
              </div>

            </div>

            {/* ================= CHART ================= */}
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
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
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

            {/* ================= HISTORY ================= */}
            <div className="bg-white p-6 rounded-xl shadow">

              <h3 className="mb-4 font-semibold">
                Upload History
              </h3>

              {data.history?.length > 0 ? (

                data.history.map((item) => (

                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border p-3 mb-3 rounded flex justify-between items-center"
                  >

                    <div>
                      <p className="font-medium">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.date}
                      </p>
                    </div>

                    <div className="flex gap-2">

                      <button
                        onClick={() => handleOpen(item.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Open
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </button>

                    </div>

                  </motion.div>

                ))

              ) : (

                <p className="text-gray-500 text-center">
                  No documents uploaded yet.
                </p>

              )}

            </div>

          </>
        )}

      </motion.div>

    </MainLayout>
  );
}