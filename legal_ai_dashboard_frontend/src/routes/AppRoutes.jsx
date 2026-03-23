import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Dashboard from "../pages/Dashboard";
import UploadPage from "../pages/UploadPage";
import SummaryPage from "../pages/SummaryPage";
import ChatbotPage from "../pages/ChatbotPage";
import NERPage from "../pages/NERPage";
import RiskPage from "../pages/RiskPage";
import ActsPage from "../pages/ActsPage";
export default function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/summary/:docId" element={<SummaryPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/acts/:docId" element={<ActsPage />} />
        <Route path="/risk/:docId" element={<RiskPage />} />
        <Route path="/ner/:docId" element={<NERPage />} />
      </Routes>

    </BrowserRouter>

  );
}