import MainLayout from "../layout/MainLayout";
import { motion } from "framer-motion";
import { useAnalysis } from "../context/AnalysisContext";

export default function NERPage() {

  const { analysisData } = useAnalysis();
  const entities = analysisData?.entities || [];

  // 🎨 Color mapping for entity types
  const getColor = (label) => {
    switch (label) {
      case "PERSON":
        return "bg-blue-400/30";
      case "ORG":
        return "bg-green-400/30";
      case "LOCATION":
        return "bg-yellow-400/30";
      case "DATE":
        return "bg-pink-400/30";
      default:
        return "bg-white/20";
    }
  };

  return (

    <MainLayout>

      {/* 🌈 Background */}
      <div className="bg-main min-h-screen p-6 text-white">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >

          {/* Title */}
          <h1 className="text-2xl font-bold mb-6">
            Named Entities
          </h1>

          {/* ✅ Entity List */}
          {entities.length > 0 ? (

            <div className="glass p-6 shadow-lg">

              <div className="flex flex-wrap gap-3">

                {entities.map((e, i) => (

                  <motion.span
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`px-3 py-1 rounded-full text-sm backdrop-blur border border-white/20 ${getColor(e.label)}`}
                  >
                    {e.text} ({e.label})
                  </motion.span>

                ))}

              </div>

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