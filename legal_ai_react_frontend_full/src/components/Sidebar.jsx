import {Link} from "react-router-dom"

function Sidebar(){

return(

<div className="w-64 bg-gray-900 text-white min-h-screen p-5">

<h2 className="text-2xl font-bold mb-6">

Legal AI

</h2>

<nav className="space-y-3">

<Link to="/dashboard">Dashboard</Link>

<br/>

<Link to="/upload">Upload Document</Link>

<br/>

<Link to="/contracts">Contracts</Link>

<br/>

<Link to="/agreements">Agreements</Link>

<br/>

<Link to="/analysis">Analysis</Link>

<br/>

<Link to="/legal-chat">Legal Chatbot</Link>

<br/>
<Link to="/viewer">Document Viewer</Link>

</nav>

</div>

)

}

export default Sidebar