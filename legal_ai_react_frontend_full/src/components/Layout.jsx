import Sidebar from "./Sidebar"
import Topbar from "./Topbar"
import ChatbotDrawer from "./ChatbotDrawer"

export default function Layout({children}){

return(

<div className="flex h-screen bg-gray-100">

<Sidebar/>

<div className="flex-1 flex flex-col">

<Topbar/>

<div className="flex-1 overflow-auto p-6">
{children}
</div>

</div>

<ChatbotDrawer/>

</div>

)
}