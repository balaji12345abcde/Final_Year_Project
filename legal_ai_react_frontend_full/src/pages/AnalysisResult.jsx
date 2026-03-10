import Layout from "../components/Layout"
import { analyzeDocument } from "../services/api"
export default function AnalysisResult(){
const result=await analyzeDocument(1,"What crime is mentioned?")
return(

<Layout>

<h2 className="text-2xl font-semibold mb-6">
AI Legal Analysis Result
</h2>

<div className="grid grid-cols-2 gap-6">

<div className="bg-white p-6 shadow rounded">

<h3 className="font-semibold mb-2">Detected Law</h3>

<p>IPC Section 420</p>

</div>

<div className="bg-white p-6 shadow rounded">

<h3 className="font-semibold mb-2">Risk Level</h3>

<p className="text-red-500">High Risk</p>

</div>

</div>

</Layout>

)
}