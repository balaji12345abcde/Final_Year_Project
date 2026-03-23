import { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { getDashboard } from "../api/api";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard();
      setData(res);
    } catch (err) {
      console.error(err);
    }
  };

  // 🎨 Chart Colors
  const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444"];

  return (
    <MainLayout>

      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      {data && (
        <>

          {/* ================== STATS ================== */}
          <div className="grid grid-cols-3 gap-6 mb-6">

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">Uploaded Documents</h3>
              <p className="text-3xl font-bold mt-2">
                {data.total_documents}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">Latest Type</h3>
              <p className="text-xl mt-2">
                {data.document_type}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="text-gray-500">Risk Level</h3>
              <p className={`text-xl mt-2 font-semibold ${
                data.risk_level === "High"
                  ? "text-red-500"
                  : data.risk_level === "Medium"
                  ? "text-yellow-500"
                  : "text-green-500"
              }`}>
                {data.risk_level}
              </p>
            </div>

          </div>


          {/* ================== CHART ================== */}
          <div className="bg-white p-6 rounded-xl shadow mb-6">

            <h3 className="mb-4 font-semibold text-gray-700">
              Document Distribution
            </h3>

            {data.chart_data && data.chart_data.length > 0 ? (

              <ResponsiveContainer width="100%" height={300}>
                <PieChart>

                  <Pie
                    data={data.chart_data}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}

                    // ✅ Smart label (avoids overlap)
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

                  {/* ✅ Tooltip */}
                  <Tooltip
                    formatter={(value, name) => [`${value}`, name]}
                  />

                  {/* ✅ Legend */}
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

            {data.history && data.history.length > 0 ? (

              data.history.map((item, i) => (
                <div
                  key={i}
                  className="border p-3 mb-2 rounded flex justify-between"
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

    </MainLayout>
  );
}