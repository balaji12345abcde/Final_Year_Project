import Layout from "../components/Layout"

export default function LegalChat(){

return(

<Layout>

<h2 className="text-2xl font-semibold mb-6">
Legal AI Assistant
</h2>

<div className="bg-white shadow rounded p-6">

<input
className="border w-full p-3 mb-4"
placeholder="Ask any legal question..."
/>

<button className="bg-blue-600 text-white px-6 py-2 rounded">
Ask AI
</button>

</div>

</Layout>

)
}