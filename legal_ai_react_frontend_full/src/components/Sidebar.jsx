import {Link} from "react-router-dom"

export default function Sidebar(){

return(

<div className="w-64 bg-slate-900 text-white flex flex-col">

<div className="p-6 text-2xl font-bold border-b border-slate-700">
LegalAI
</div>

<nav className="flex-1 p-4 space-y-3">

<Link to="/dashboard" className="block hover:bg-slate-800 p-3 rounded">
Dashboard
</Link>

<Link to="/upload" className="block hover:bg-slate-800 p-3 rounded">
Upload Document
</Link>

<Link to="/contracts" className="block hover:bg-slate-800 p-3 rounded">
Contracts
</Link>

<Link to="/agreements" className="block hover:bg-slate-800 p-3 rounded">
Agreements
</Link>

<Link to="/complaints" className="block hover:bg-slate-800 p-3 rounded">
Crime Complaints
</Link>

<Link to="/history" className="block hover:bg-slate-800 p-3 rounded">
Analysis History
</Link>

<Link to="/legal-chat" className="block hover:bg-slate-800 p-3 rounded">
Legal Chatbot
</Link>

</nav>

</div>

)
}