import { useState } from "react";
import { uploadDocument } from "../api/api";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { motion } from "framer-motion";
import { useAnalysis } from "../context/AnalysisContext";

export default function UploadPage() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAnalysisData } = useAnalysis();

  const navigate = useNavigate();

  const handleUpload = async () => {

    if (!file) {
      alert("Please select a file");
      return;
    }

    try {

      setLoading(true);

      const res = await uploadDocument(file);

      const docId = res.document_id;

      // 🔥 CLEAR OLD DATA
      setAnalysisData(null);

      localStorage.setItem("docId", docId);

      navigate(`/summary/${docId}`);

    } catch (err) {

      console.error(err);
      alert("Upload failed");

    } finally {

      setLoading(false);
    }
  };

  return (

    <MainLayout>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

        <h1 className="text-2xl font-bold mb-6">
          Upload Document
        </h1>

        <div className="bg-white p-6 rounded shadow w-96">

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="mb-4"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUpload}
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
          >
            {loading ? "Uploading..." : "Upload"}
          </motion.button>

        </div>

      </motion.div>

    </MainLayout>
  );
}