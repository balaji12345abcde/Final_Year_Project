
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Upload from "./pages/Upload"
import Contract from "./pages/Contract"
import Agreement from "./pages/Agreement"
import ChatbotPage from "./pages/ChatbotPage"

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/upload" element={<Upload/>}/>
        <Route path="/contract" element={<Contract/>}/>
        <Route path="/agreement" element={<Agreement/>}/>
        <Route path="/chatbot" element={<ChatbotPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}
