import { createContext, useContext, useState, useEffect } from "react";

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {

  // 🔥 Store data per document
  const [analysisData, setAnalysisData] = useState(null);
  const [summaryChunks, setSummaryChunks] = useState([]);
  const [docId, setDocId] = useState(null);

  // =========================================
  // 🔥 LOAD FROM LOCAL STORAGE ON START
  // =========================================
  useEffect(() => {

    const savedDocId = localStorage.getItem("docId");

    if (savedDocId) {

      setDocId(savedDocId);

      const savedAnalysis = localStorage.getItem(`analysis_${savedDocId}`);
      const savedSummary = localStorage.getItem(`summary_${savedDocId}`);

      if (savedAnalysis) {
        setAnalysisData(JSON.parse(savedAnalysis));
      }

      if (savedSummary) {
        setSummaryChunks(JSON.parse(savedSummary));
      }

    }

  }, []);

  // =========================================
  // 🔥 SAVE ANALYSIS DATA
  // =========================================
  useEffect(() => {

    if (analysisData && docId) {
      localStorage.setItem(
        `analysis_${docId}`,
        JSON.stringify(analysisData)
      );
    }

  }, [analysisData, docId]);

  // =========================================
  // 🔥 SAVE SUMMARY
  // =========================================
  useEffect(() => {

    if (summaryChunks.length > 0 && docId) {
      localStorage.setItem(
        `summary_${docId}`,
        JSON.stringify(summaryChunks)
      );
    }

  }, [summaryChunks, docId]);

  // =========================================
  // 🔥 SWITCH DOCUMENT
  // =========================================
  const loadDocument = (newDocId) => {

    setDocId(newDocId);
    localStorage.setItem("docId", newDocId);

    const savedAnalysis = localStorage.getItem(`analysis_${newDocId}`);
    const savedSummary = localStorage.getItem(`summary_${newDocId}`);

    setAnalysisData(savedAnalysis ? JSON.parse(savedAnalysis) : null);
    setSummaryChunks(savedSummary ? JSON.parse(savedSummary) : []);
  };

  // =========================================
  // 🔥 CLEAR DATA (NEW UPLOAD)
  // =========================================
  const clearAnalysis = () => {
    setAnalysisData(null);
    setSummaryChunks([]);
  };

  return (
    <AnalysisContext.Provider
      value={{
        analysisData,
        setAnalysisData,
        summaryChunks,
        setSummaryChunks,
        docId,
        setDocId,
        loadDocument,
        clearAnalysis
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => useContext(AnalysisContext);