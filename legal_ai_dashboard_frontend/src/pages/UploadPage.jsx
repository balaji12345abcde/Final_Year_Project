import { useState, useRef } from "react";
import { uploadDocument } from "../api/api";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import { motion } from "framer-motion";
import { useAnalysis } from "../context/AnalysisContext";

export default function UploadPage() {

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  const { loadDocument, clearAnalysis } = useAnalysis();
  const navigate = useNavigate();

  // =========================
  // VALIDATION
  // =========================
  const validateFile = (selected) => {

    if (!selected) return;

    if (!selected.name.toLowerCase().endsWith(".pdf")) {
      setError("❌ Only PDF files allowed");
      return;
    }

    if (selected.size > 10 * 1024 * 1024) {
      setError("❌ File must be under 10MB");
      return;
    }

    setError("");
    setFile(selected);
  };

  // =========================
  // FILE SELECT
  // =========================
  const handleFileChange = (e) => {
    validateFile(e.target.files[0]);
  };

  // =========================
  // DRAG EVENTS
  // =========================
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    validateFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  // =========================
  // REMOVE FILE
  // =========================
  const removeFile = () => {
    setFile(null);
  };

  // =========================
  // UPLOAD
  // =========================
  const handleUpload = async () => {

    if (!file || loading) return;

    try {

      setLoading(true);

      const res = await uploadDocument(file);
      const docId = res.document_id;

      clearAnalysis();
      loadDocument(docId);

      localStorage.removeItem(`summary_${docId}`);

      // 🔥 Smooth navigation delay
      setTimeout(() => {
        navigate(`/summary/${docId}`);
      }, 300);

    } catch (err) {
      console.error(err);
      setError("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <MainLayout>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[80vh]"
      >

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-white mb-2">
          📄 Upload Legal Document
        </h1>

        <p className="text-gray-300 mb-6">
          Analyze legal documents instantly with AI
        </p>

        {/* DROP ZONE */}
        <motion.div
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          whileHover={{ scale: 1.02 }}
          className={`w-[420px] p-6 rounded-2xl border-2 border-dashed text-center transition cursor-pointer
            ${dragActive
              ? "border-green-400 bg-white/20"
              : "border-white/40 bg-white/10"}
          `}
        >

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            hidden
          />

          {!file ? (
            <>
              <p className="text-white mb-3 text-lg">
                Drag & Drop your PDF
              </p>

              <p className="text-sm text-gray-300">
                Click to browse
              </p>
            </>
          ) : (
            <div className="text-center">

              <p className="text-green-400 font-medium mb-2">
                ✅ {file.name}
              </p>

              <p className="text-sm text-gray-300">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="mt-3 text-red-400 text-sm hover:underline"
              >
                Remove File
              </button>

            </div>
          )}

        </motion.div>

        {/* ERROR */}
        {error && (
          <p className="text-red-400 mt-3">{error}</p>
        )}

        {/* UPLOAD BUTTON */}
        <motion.button
          whileHover={{ scale: loading ? 1 : 1.05 }}
          whileTap={{ scale: loading ? 1 : 0.95 }}
          onClick={handleUpload}
          disabled={loading || !file}
          className={`mt-6 px-6 py-3 rounded-xl shadow-lg transition
            ${loading
              ? "bg-gray-400 text-white"
              : "bg-indigo-600 text-white hover:bg-indigo-700"}
          `}
        >
          {loading ? "⏳ Uploading..." : "🚀 Upload & Analyze"}
        </motion.button>

        {/* LOADING TEXT */}
        {loading && (
          <p className="mt-4 text-gray-300 animate-pulse">
            AI is processing your document...
          </p>
        )}

      </motion.div>

    </MainLayout>
  );
}