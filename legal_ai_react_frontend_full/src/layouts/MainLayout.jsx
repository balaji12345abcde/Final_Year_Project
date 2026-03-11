import Sidebar from "../components/Sidebar"
import Topbar from "../components/Topbar"

function MainLayout({children}){

return(

<div className="flex">

<Sidebar/>

<div className="flex-1">

<Topbar/>

<div className="p-6">

{children}

</div>

</div>

</div>

)

}

export default MainLayout