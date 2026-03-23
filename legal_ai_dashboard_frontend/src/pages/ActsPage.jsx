import MainLayout from "../layout/MainLayout";
import { motion } from "framer-motion";
import { useAnalysis } from "../context/AnalysisContext";

export default function ActsPage() {

  const { analysisData } = useAnalysis();

  const acts = analysisData?.acts || [];

  return (

    <MainLayout>

      {/* 🌈 Gradient Background */}
      <div className="bg-main min-h-screen p-6 text-white">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >

          {/* Title */}
          <h1 className="text-2xl font-bold mb-6">
            Acts & Sections
          </h1>

          {/* ✅ Acts List */}
          {acts.length > 0 ? (

            <div className="space-y-4">

              {acts.map((a, i) => (

                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="glass p-5 shadow-lg hover:scale-[1.02] transition"
                >

                  {/* Act Title */}
                  <h3 className="font-semibold text-lg">
                    {a.act} - Section {a.section}
                  </h3>

                  {/* Reason */}
                  {a.reason && (
                    <p className="mt-2 text-sm opacity-80">
                      {a.reason}
                    </p>
                  )}

                </motion.div>

              ))}

            </div>

          ) : (

            <div className="glass p-6 text-center opacity-80">
              No data available. Please analyze document first.
            </div>

          )}

        </motion.div>

      </div>

    </MainLayout>
  );
}