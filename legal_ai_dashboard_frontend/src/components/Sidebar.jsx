export default function Sidebar() {

 return (

  <div className="w-64 bg-white shadow-xl h-screen p-6 flex flex-col">

   <h1 className="text-2xl font-bold mb-10">
    ⚖ Legal AI
   </h1>

   <div className="space-y-3">

    <div className="p-3 rounded-lg bg-blue-100 cursor-pointer hover:bg-blue-200 transition">
      Dashboard
    </div>

    <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition">
      Upload Document
    </div>

    <div className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition">
      Analysis
    </div>

   </div>

  </div>

 )
}