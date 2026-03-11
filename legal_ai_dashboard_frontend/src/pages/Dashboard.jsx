import { useState } from "react"
import Layout from "../layout/Layout"
import { analyzeDocument } from "../api/api"
import Chatbot from "../components/Chatbot"
import Entities from "../components/Entities"

export default function Dashboard(){

 const [docId,setDocId] = useState("")
 const [query,setQuery] = useState("What crime is mentioned?")
 const [data,setData] = useState(null)
 const [loading,setLoading] = useState(false)

 const analyze = async ()=>{

  if(!docId) return

  setLoading(true)

  try{

   const result = await analyzeDocument(docId,query)

   setData(result)

  }catch(err){

   console.log(err)

  }

  setLoading(false)

 }

 return(

 <Layout>

  <h1 className="text-3xl font-bold mb-6">
   Document Analysis
  </h1>

  <div className="flex gap-3 mb-8">

   <input
    placeholder="Enter Document ID"
    value={docId}
    onChange={(e)=>setDocId(e.target.value)}
    className="border p-3 rounded w-64"
   />

   <button
    onClick={analyze}
    className="bg-green-500 text-white px-5 rounded hover:bg-green-600 transition"
   >
    Analyze
   </button>

  </div>

  {loading && (

   <div className="text-blue-600 font-semibold mb-4">
    Analyzing document...
   </div>

  )}

  {data && (

   <div className="grid grid-cols-3 gap-6">

    <div className="col-span-2 space-y-6">

     <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="font-semibold text-lg">
       Document Type
      </h2>

      <p className="text-xl mt-2">
       {data.document_type}
      </p>

     </div>

     <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="font-semibold text-lg mb-2">
       Summary
      </h2>

      <p className="text-gray-700 whitespace-pre-wrap">
       {data.summary}
      </p>

     </div>

     <div className="grid grid-cols-2 gap-4">

      <div className="bg-white p-4 rounded-xl shadow">

       <h3 className="font-semibold">
        Act
       </h3>

       <p>{data.act_name}</p>

       <h3 className="font-semibold mt-3">
        Section
       </h3>

       <p>{data.section_number}</p>

       <h3 className="font-semibold mt-3">
        Confidence
       </h3>

       <p>{data.confidence_score}</p>

      </div>

      <div className="bg-white p-4 rounded-xl shadow">

       <h3 className="font-semibold">
        Risk Level
       </h3>

       <p className="text-red-500 font-bold text-lg">
        {data.risk_level}
       </p>

      </div>

     </div>

     <Entities entities={data.entities}/>

    </div>

    <Chatbot
     query={query}
     setQuery={setQuery}
     ask={analyze}
     answer={data.chatbot_response}
    />

   </div>

  )}

 </Layout>

 )
}