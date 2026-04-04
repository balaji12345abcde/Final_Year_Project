import axios from "axios";

// ==========================
// 🌐 BASE CONFIG
// ==========================
const BASE_URL = "http://127.0.0.1:8000/api/v1";

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 🔥 prevent hanging
});

// ==========================
// 🔐 ATTACH TOKEN
// ==========================
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================
// ⚠️ GLOBAL ERROR HANDLER
// ==========================
API.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }

    if (error.response?.status >= 500) {
      console.error("Server error:", error.response);
    }

    return Promise.reject(error);
  }
);

// ==========================
// 📤 UPLOAD DOCUMENT
// ==========================
export const uploadDocument = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/documents/upload/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// ==========================
// 🧠 ANALYZE DOCUMENT (RUN ONCE)
// ==========================
export const analyzeDocument = async (documentId) => {
  const res = await API.post("/nlp/analyze/", {
    document_id: documentId,
  });

  return res.data;
};

// ==========================
// 🔥 GET SAVED ANALYSIS (VERY IMPORTANT)
// ==========================
export const getAnalysis = async (docId) => {
  const res = await API.get(`/nlp/analysis/${docId}/`);
  return res.data;
};

// ==========================
// ⚡ STREAM SUMMARY (UI ONLY)
// ==========================
export const streamSummary = (docId, onData, onError) => {

  // ❗ EventSource doesn't support headers → token issue
  const url = `${BASE_URL}/nlp/stream-summary/${docId}/`;

  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {

    if (!event.data) return;

    if (event.data === "[DONE]") {
      onData("[DONE]");
      eventSource.close();
      return;
    }

    onData(event.data);
  };

  eventSource.onerror = (err) => {
    console.warn("Streaming error:", err);
    eventSource.close();

    if (onError) onError(err);
  };

  return eventSource;
};

// ==========================
// 🤖 DOCUMENT CHATBOT
// ==========================
export const askDocumentBot = async (documentId, question) => {
  const res = await API.post("/chat/document-chat/", {
    document_id: documentId,
    question,
  });

  return res.data;
};

// ==========================
// ⚖️ GENERAL CHATBOT
// ==========================
export const askLegalBot = async (question) => {
  const res = await API.post("/chat/general-chat/", {
    question,
  });

  return res.data;
};

// ==========================
// 🔐 LOGIN
// ==========================
export const loginUser = async (username, password) => {
  const res = await API.post("/users/login/", {
    username,
    password,
  });

  localStorage.setItem("token", res.data.access);

  return res.data;
};

// ==========================
// 📝 REGISTER
// ==========================
export const registerUser = async (data) => {
  const res = await API.post("/users/register/", data);
  return res.data;
};

// ==========================
// 📊 DASHBOARD
// ==========================
export const getDashboard = async () => {
  const res = await API.get("/documents/dashboard/");
  return res.data;
};

// ==========================
// 🌍 TRANSLATION (DB + CACHE)
// ==========================
export const translateSummary = async (text, lang, docId) => {

  // 🔥 Better cache key
  const cacheKey = `summary_${docId}_${lang}_${btoa(text).slice(0, 30)}`;

  // 🔥 FRONTEND CACHE
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    return { translated_text: cached };
  }

  const res = await API.post("/nlp/translate/", {
    text,
    lang,
    document_id: docId   // ✅ CRITICAL FIX
  });

  // 🔥 SAVE CACHE
  localStorage.setItem(cacheKey, res.data.translated_text);

  return res.data;
};

// ==========================
// 🗑️ DELETE DOCUMENT
// ==========================
export const deleteDocument = async (docId) => {
  const res = await API.delete(`/documents/delete/${docId}/`);
  return res.data;
};

export default API;