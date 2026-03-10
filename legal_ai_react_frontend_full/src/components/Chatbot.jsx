import { useState } from "react"

export default function Chatbot(){

const [message,setMessage] = useState("")
const [chat,setChat] = useState([])

const sendMessage = ()=>{

if(!message) return

setChat([...chat,{user:message,bot:"AI response for: "+message}])
setMessage("")
}

return(

<div className="fixed right-0 top-0 w-80 h-screen bg-white shadow-lg p-4">

<h2 className="font-bold mb-3">
Legal AI Chatbot
</h2>

<div className="h-96 overflow-y-auto border p-2 mb-2">

{chat.map((c,i)=>(
<div key={i}>
<p className="text-right text-blue-600">{c.user}</p>
<p className="text-left text-gray-700">{c.bot}</p>
</div>
))}

</div>

<input
value={message}
onChange={(e)=>setMessage(e.target.value)}
className="border w-full p-2 mb-2"
/>

<button
onClick={sendMessage}
className="bg-blue-600 text-white w-full p-2 rounded"
>
Send
</button>

</div>

)

}