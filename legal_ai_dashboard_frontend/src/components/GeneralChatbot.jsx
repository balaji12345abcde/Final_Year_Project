import { useState } from "react"
import { askLegalBot } from "../api/api"

export default function GeneralChatbot({closeChat}){

 const [question,setQuestion] = useState("")
 const [answer,setAnswer] = useState("")
 const [loading,setLoading] = useState(false)

 const ask = async()=>{

  if(!question) return

  try{

   setLoading(true)

   const res = await askLegalBot(question)

   setAnswer(res.answer)

  }catch(err){

   console.error(err)

  }finally{

   setLoading(false)

  }

 }

 return(

  <div className="fixed bottom-6 left-6 w-80 bg-white shadow-2xl rounded-xl p-4 z-50">

   <div className="flex justify-between items-center mb-2">

    <h3 className="font-semibold text-lg">
     ⚖ Legal Assistant
    </h3>

    <button
     onClick={closeChat}
     className="text-gray-500 hover:text-red-500 text-lg"
    >
     ✕
    </button>

   </div>

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

   {loading && (
    <p className="text-sm text-gray-500 mt-2">
     Thinking...
    </p>
   )}

   <div className="mt-3 text-gray-700 max-h-40 overflow-y-auto">
    {answer}
   </div>

  </div>

 )

}