import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"

export default function MainLayout({children}){

 return(

  <div className="flex">

   <Sidebar/>

   <div className="flex-1">

    <Navbar/>

    <div className="p-8 bg-gray-100 min-h-screen">

     {children}

    </div>

   </div>

  </div>

 )

}