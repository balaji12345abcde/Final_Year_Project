import {BrowserRouter,Routes,Route} from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Upload from "./pages/Upload"
import Contracts from "./pages/Contracts"
import Agreements from "./pages/Agreements"
import Analysis from "./pages/Analysis"
import LegalChat from "./pages/LegalChat"
import DocumentViewer from './pages/DocumentViewer'
function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Login/>}/>
<Route path="/register" element={<Register/>}/>

<Route path="/dashboard" element={<Dashboard/>}/>
<Route path="/upload" element={<Upload/>}/>
<Route path="/contracts" element={<Contracts/>}/>
<Route path="/agreements" element={<Agreements/>}/>
<Route path="/analysis" element={<Analysis/>}/>
<Route path="/legal-chat" element={<LegalChat/>}/>
<Route path="/viewer" element={<DocumentViewer/>}/>
</Routes>

</BrowserRouter>

)

}

export default App