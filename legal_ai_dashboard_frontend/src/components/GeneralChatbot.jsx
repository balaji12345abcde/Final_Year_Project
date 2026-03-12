import { useState } from "react"
import { askLegalBot } from "../api/api"

export default function GeneralChatbot(){

 const [question,setQuestion] = useState("")
 const [answer,setAnswer] = useState("")

 const ask = async()=>{

  const res = await askLegalBot(question)

  setAnswer(res.answer)

 }

 return(

  <div className="fixed bottom-6 left-6 w-80 bg-white shadow-2xl rounded-xl p-4 z-50">

   <h3 className="font-semibold text-lg mb-2">
    ⚖ Legal Assistant
   </h3>

   <input
    className="border p-2 w-full rounded"
    placeholder="Ask legal question..."
    value={question}
    onChange={(e)=>setQuestion(e.target.value)}
   />

   <button
    onClick={ask}
    className="bg-green-500 text-white px-4 py-2 rounded mt-3 w-full"
   >
    Ask
   </button>

   <div className="mt-3 text-gray-700 max-h-40 overflow-y-auto">
    {answer}
   </div>

  </div>

 )

}