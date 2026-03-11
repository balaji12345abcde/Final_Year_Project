import {useState} from "react"

function Chatbot(){

const [msg,setMsg] = useState("")
const [chat,setChat] = useState([])

const send = ()=>{

setChat([...chat,{q:msg,a:"AI response for "+msg}])
setMsg("")

}

return(

<div className="fixed right-0 bottom-0 w-80 bg-white shadow-lg p-4">

<h3 className="font-bold mb-2">

Legal Chatbot

</h3>

<div className="h-60 overflow-y-auto">

{chat.map((c,i)=>(

<div key={i}>

<p className="text-blue-500">{c.q}</p>
<p>{c.a}</p>

</div>

))}

</div>

<input

value={msg}
onChange={(e)=>setMsg(e.target.value)}

className="border w-full p-2 mt-2"

/>

<button

onClick={send}

className="bg-blue-600 text-white w-full mt-2 p-2"

>

Send

</button>

</div>

)

}

export default Chatbot