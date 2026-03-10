import Layout from "../components/Layout"
import { uploadDocument } from "../services/api"

const upload=async (e)=>{
    const file=e.target.files[0] 
await uploadDocument(file)
}
export default function Upload(){
return(

<Layout>

<h2 className="text-2xl font-semibold mb-6">
Upload Legal Document
</h2>

<div className="bg-white shadow rounded p-10 text-center">

<input type="file" className="mb-4"/>

<br/>

<button className="bg-blue-600 text-white px-6 py-2 rounded">
Upload & Analyze
</button>

</div>

</Layout>

)
}