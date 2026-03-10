import {useState} from "react"

export default function ChatbotDrawer(){

const [open,setOpen] = useState(false)

return(

<div className={`fixed right-0 top-0 h-full ${open?"w-80":"w-16"} bg-white shadow-lg`}>

<button
onClick={()=>setOpen(!open)}
className="bg-blue-600 text-white p-3"
>
AI
</button>

{open && (

<div className="p-4">

<h3 className="font-semibold mb-3">
Document Chatbot
</h3>

<input
className="border w-full p-2 mb-2"
placeholder="Ask about document..."
/>

<button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
Ask
</button>

</div>

)}

</div>

)
}