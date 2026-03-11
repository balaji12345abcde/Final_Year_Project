import {useState} from "react"
import {loginUser} from "../api/api"

function Login(){

const [username,setUsername] = useState("")
const [password,setPassword] = useState("")

const login = async()=>{

const res = await loginUser({username,password})

localStorage.setItem("token",res.data.access)

window.location="/dashboard"

}

return(

<div className="flex justify-center items-center h-screen">

<div className="bg-white shadow p-6">

<h2 className="text-xl mb-4">

Login

</h2>

<input
placeholder="Username"
onChange={(e)=>setUsername(e.target.value)}
className="border p-2 mb-2"
/>

<input
placeholder="Password"
type="password"
onChange={(e)=>setPassword(e.target.value)}
className="border p-2 mb-2"
/>

<button
onClick={login}
className="bg-blue-600 text-white p-2 w-full"
>

Login

</button>

</div>

</div>

)

}

export default Login