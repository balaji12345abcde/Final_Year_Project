import Sidebar from "../components/Sidebar"

export default function Layout({ children }) {

 return (

  <div className="flex bg-gray-100 min-h-screen">

   <Sidebar/>

   <div className="flex-1 p-8">
     {children}
   </div>

  </div>

 )
}