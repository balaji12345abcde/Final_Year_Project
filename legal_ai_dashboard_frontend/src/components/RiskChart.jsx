import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

export default function RiskChart({ level }) {

  // convert risk level to percentage
  const riskPercent = level === "High Risk" ? 80 : level === "Medium Risk" ? 50 : 20

  const data = [
    { name: "Risk", value: riskPercent },
    { name: "Safe", value: 100 - riskPercent }
  ]

  const COLORS = ["#ef4444", "#22c55e"]

  return (

    <div className="flex flex-col items-center">

      {/* Title */}
      <h3 className="text-lg font-semibold mb-4">
        Risk Assessment
      </h3>

      <PieChart width={260} height={260}>

        <Pie
          data={data}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={90}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >

          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}

        </Pie>

        <Tooltip />
        <Legend />

      </PieChart>

      {/* Risk Score */}
      <div className="mt-4 text-center">

        <p className="text-gray-600 text-sm">
          Risk Score
        </p>

        <p className="text-2xl font-bold text-red-500">
          {riskPercent}%
        </p>

      </div>

    </div>

  )

}