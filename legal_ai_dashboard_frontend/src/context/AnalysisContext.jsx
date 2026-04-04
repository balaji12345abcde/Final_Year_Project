import { createContext, useContext, useState } from "react";

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {

  const [analysisData, setAnalysisData] = useState(null);

  const [summaryData, setSummaryData] = useState({
    chunks: [],
    isFinished: false
  });

  const [docId, setDocId] = useState(null);

  // =========================
  // 🔄 LOAD DOCUMENT
  // =========================
  const loadDocument = (newDocId) => {

    setDocId(newDocId);

    // 🔥 Reset states when switching doc
    setAnalysisData(null);
    setSummaryData({
      chunks: [],
      isFinished: false
    });
  };

  // =========================
  // 🧹 CLEAR
  // =========================
  const clearAnalysis = () => {
    setAnalysisData(null);
    setSummaryData({
      chunks: [],
      isFinished: false
    });
    setDocId(null);
  };

  return (
    <AnalysisContext.Provider
      value={{
        analysisData,
        setAnalysisData,
        summaryData,
        setSummaryData,
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