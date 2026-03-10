export default function Topbar(){

return(

<div className="bg-white shadow px-6 py-4 flex justify-between">

<h1 className="font-semibold text-lg">
AI Legal Document Intelligence
</h1>

<div className="flex items-center space-x-4">

<button className="bg-blue-600 text-white px-4 py-2 rounded">
New Analysis
</button>

<div className="w-10 h-10 bg-gray-300 rounded-full"/>

</div>

</div>

)
}