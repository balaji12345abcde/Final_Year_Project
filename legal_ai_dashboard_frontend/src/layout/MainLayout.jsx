import { useState } from "react"
import Sidebar from "../components/Sidebar"
import Navbar from "../components/Navbar"
import GeneralChatbot from "../components/GeneralChatbot"

export default function MainLayout({children}){

 const [showChat,setShowChat] = useState(false)

 return(

  <div className="flex">

   <Sidebar openChat={()=>setShowChat(true)}/>

   <div className="flex-1">

    <Navbar/>

    <div className="p-8 bg-gray-100 min-h-screen">

     {children}

    </div>

   </div>

   {showChat && (
     <GeneralChatbot closeChat={()=>setShowChat(false)}/>
   )}

  </div>

 )

}