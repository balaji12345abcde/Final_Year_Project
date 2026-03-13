import { BrowserRouter, Routes, Route } from "react-router-dom"

import Dashboard from "../pages/Dashboard"
import UploadPage from "../pages/UploadPage"
import AnalysisPage from "../pages/AnalysisPage"
import GeneralChatbot from "../components/GeneralChatbot"

export default function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/upload" element={<UploadPage />} />

        <Route path="/analysis/:docId" element={<AnalysisPage />} />

      </Routes>

    </BrowserRouter>

  )

}