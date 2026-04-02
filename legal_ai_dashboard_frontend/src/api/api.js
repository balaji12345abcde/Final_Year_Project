import axios from "axios";

// ==========================
// 🌐 BASE API INSTANCE
// ==========================
const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// ==========================
// 🔐 ATTACH TOKEN TO REQUEST
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
// ⚠️ HANDLE AUTH ERRORS
// ==========================
API.interceptors.response.use(
  (response) => response,
  (error) => {

    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);



// ==========================
// 📤 Upload Document
// ==========================
export const uploadDocument = async (file) => {

  const formData = new FormData();
  formData.append("file", file);

  const res = await API.post("/documents/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};


// ==========================
// 🧠 Analyze Document
// ==========================
export const analyzeDocument = async (documentId) => {

  const res = await API.post("/nlp/analyze/", {
    document_id: documentId,
  });

  return res.data;
};


// ==========================
// ⚡ STREAM SUMMARY (FIXED 🔥)
// ==========================
export const streamSummary = (docId, onData) => {

  const url = `http://127.0.0.1:8000/api/nlp/stream-summary/${docId}/`;

  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {

    // ✅ END SIGNAL
    if (event.data === "[DONE]") {
      eventSource.close();
      return;
    }

    if (event.data) {
      onData(event.data);
    }
  };

  eventSource.onerror = () => {
    // ⚠️ Normal close also triggers this → DON'T show error
    eventSource.close();
  };

  return eventSource;
};


// ==========================
// 🤖 Document Chatbot
// ==========================
export const askDocumentBot = async (documentId, question) => {

  const res = await API.post("/chat/document/", {
    document_id: documentId,
    question: question,
  });

  return res.data;
};


// ==========================
// ⚖️ General Legal Chatbot
// ==========================
export const askLegalBot = async (question) => {

  const res = await API.post("/chat/general/", {
    question: question,
  });

  return res.data;
};


// ==========================
// 🔐 LOGIN (JWT)
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
// 📂 USER DOCUMENTS (FUTURE)
// ==========================
export const getUserDocuments = async () => {

  return [
    { id: 1, name: "Contract.pdf", date: "2026-03-20" },
    { id: 2, name: "Agreement.docx", date: "2026-03-21" },
  ];
};


export default API;