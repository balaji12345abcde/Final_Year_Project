
import Sidebar from "../components/Sidebar"
import Chatbot from "../components/Chatbot"

export default function ChatbotPage(){

  return(
    <div className="flex">

      <Sidebar/>

      <div className="flex-1 p-6">
        <h1 className="text-xl mb-4">Legal AI Chatbot</h1>
        Ask general legal questions.
      </div>

      <Chatbot/>

    </div>
  )
}
