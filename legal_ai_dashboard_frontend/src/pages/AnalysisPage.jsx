import { useParams } from "react-router-dom"
import { useState } from "react"
import { analyzeDocument } from "../api/api"

import Loader from "../components/Loader"
import Entities from "../components/Entities"
import RiskChart from "../components/RiskChart"
import DocumentChatbot from "../components/DocumentChatbot"

import MainLayout from "../layout/MainLayout"

export default function AnalysisPage(){

 const { docId } = useParams()

 const [data,setData] = useState(null)
 const [loading,setLoading] = useState(false)

 const runAnalysis = async ()=>{

   try{

      setLoading(true)

      const res = await analyzeDocument(docId)

      setData(res)

   }catch(err){

      console.error(err)
      alert("Analysis failed")

   }finally{

      setLoading(false)

   }

 }

 return(

  <MainLayout>

   <h1 className="text-2xl font-bold mb-6">
    Document Analysis
   </h1>

   <button
     onClick={runAnalysis}
     className="bg-indigo-600 text-white px-4 py-2 rounded mb-6"
   >
     Analyze Document
   </button>

   {loading && <Loader/>}

   {data && (

    <div className="space-y-6 max-h-[75vh] overflow-y-auto">

     {/* Document Type */}

     <div className="bg-white p-6 rounded shadow">

       <h3 className="font-semibold mb-2">
        Document Type
       </h3>

       <span className="bg-indigo-100 px-3 py-1 rounded">
         {data.document_type}
       </span>

     </div>


     {/* Structured Summary */}

     <div className="bg-white p-6 rounded shadow">

  <h3 className="font-semibold mb-4">
    Document Summary
  </h3>

  {data.summary && Object.entries(data.summary).map(([title, text], i) => (

    <div key={i} className="mb-5">

      <h4 className="text-blue-600 font-semibold mb-2">
        {title}
      </h4>

      <p className="text-gray-700">
        {text}
      </p>

    </div>

  ))}

</div>


     {/* Acts */}

     <div className="bg-white p-6 rounded shadow">

       <h3 className="font-semibold mb-3">
        Acts and Sections
       </h3>

       {data.acts.map((a,i)=>(

         <div
           key={i}
           className="border p-3 rounded mb-3"
         >

           <p className="font-semibold">
             {a.act} - Section {a.section}
           </p>

           <p className="text-sm text-gray-600">
             Reason: {a.reason}
           </p>

         </div>

       ))}

     </div>


     {/* Risk */}

     <div className="bg-white p-6 rounded shadow">

       <RiskChart riskScore={data.risk_score}/>

     </div>

     <Entities entities={data.entities}/>

    </div>

   )}

   <DocumentChatbot docId={docId}/>

  </MainLayout>

 )

}