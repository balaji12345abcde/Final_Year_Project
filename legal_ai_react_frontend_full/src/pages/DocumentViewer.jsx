import { useState } from "react"
import { Document, Page } from "react-pdf"
import { analyzeDocument } from "../api/api"
import MainLayout from "../layouts/MainLayout"

function DocumentViewer(){

const [file,setFile] = useState(null)
const [numPages,setNumPages] = useState(null)

const [result,setResult] = useState(null)

const handleFile = (e)=>{

setFile(URL.createObjectURL(e.target.files[0]))

}

const analyze = async()=>{

const res = await analyzeDocument({
document_id:1,
query:"What crime is mentioned?"
})

setResult(res.data)

}

return(

<MainLayout>

<div className="grid grid-cols-3 gap-6">

{/* PDF VIEWER */}

<div className="col-span-2 bg-white shadow p-4">

<h2 className="text-xl font-semibold mb-3">
Document Viewer
</h2>

<input type="file" onChange={handleFile}/>

{file && (

<Document
file={file}
onLoadSuccess={({numPages})=>setNumPages(numPages)}
>

{Array.from(new Array(numPages),(el,index)=>(

<Page
key={index}
pageNumber={index+1}
/>

))}

</Document>

)}

</div>


{/* AI RESULT PANEL */}

<div className="bg-white shadow p-4">

<h2 className="text-xl font-semibold mb-4">
AI Legal Analysis
</h2>

<button
onClick={analyze}
className="bg-blue-600 text-white px-4 py-2 mb-4"
>
Analyze Document
</button>

{result && (

<div className="space-y-3">

<div>

<b>Act:</b> {result.act_name}

</div>

<div>

<b>Section:</b> {result.section_number}

</div>

<div>

<b>Confidence:</b> {result.confidence_score}

</div>

<div>

<b>Risk Level:</b>

<span className="text-red-500">
{result.risk_level}
</span>

</div>

<div>

<b>Summary:</b>

<p>{result.summary}</p>

</div>

<div>

<b>Explanation:</b>

<p>{result.explanation}</p>

</div>

</div>

)}

</div>

</div>

</MainLayout>

)

}

export default DocumentViewer