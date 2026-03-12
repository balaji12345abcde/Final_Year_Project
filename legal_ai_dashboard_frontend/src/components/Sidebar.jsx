import { Link } from "react-router-dom"

export default function Sidebar(){

 return(

  <div className="w-64 bg-indigo-600 text-white h-screen p-6">

   <h1 className="text-2xl font-bold mb-10">
    ⚖ Legal AI
   </h1>

   <nav className="space-y-4">

    <Link
     to="/"
     className="block hover:bg-indigo-500 p-2 rounded"
    >
     Dashboard
    </Link>

    <Link
     to="/upload"
     className="block hover:bg-indigo-500 p-2 rounded"
    >
     Upload Document
    </Link>

   </nav>

  </div>

 )

}