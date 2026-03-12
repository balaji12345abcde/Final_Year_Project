import { useState } from "react"
import { askDocumentBot } from "../api/api"

export default function DocumentChatbot({ docId }){

 const [open,setOpen] = useState(false)
 const [question,setQuestion] = useState("")
 const [answer,setAnswer] = useState("")
 const [loading,setLoading] = useState(false)

 const ask = async()=>{

  if(!question) return

  try{

   setLoading(true)

   const res = await askDocumentBot(docId,question)

   setAnswer(res.answer)

  }catch(err){

   console.error(err)
   setAnswer("Error getting response")

  }finally{

   setLoading(false)

  }

 }

 return(

  <div>

   <button
    onClick={()=>setOpen(!open)}
    className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg z-50"
   >
    💬
   </button>

   <div
    className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-50
    ${open ? "translate-x-0" : "translate-x-full"}`}
   >

    <div className="p-4 border-b flex justify-between">

     <h3 className="font-semibold text-lg">
      Document Assistant
     </h3>

     <button onClick={()=>setOpen(false)}>
      X
     </button>

    </div>

    <div className="p-4">

     <input
      value={question}
      onChange={(e)=>setQuestion(e.target.value)}
      placeholder="Ask about this document..."
      className="border p-2 w-full rounded"
     />

     <button
      onClick={ask}
      className="bg-blue-600 text-white px-4 py-2 rounded mt-3 w-full"
     >
      Ask
     </button>

     {loading && (
      <p className="mt-3 text-gray-500">
       Thinking...
      </p>
     )}

     <div className="mt-4 text-gray-700 max-h-64 overflow-y-auto">
      {answer}
     </div>

    </div>

   </div>

  </div>

 )
}