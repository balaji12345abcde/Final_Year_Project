
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {loginUser} from "../services/api"

export default function Login(){

  const nav = useNavigate()
  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")

  const login = async ()=>{

    const res = await loginUser({username,password})

    localStorage.setItem("token",res.data.access)

    nav("/dashboard")
  }

  return(
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white p-8 shadow w-80">
        <h2 className="text-xl mb-4">Login</h2>

        <input placeholder="username"
          className="border p-2 w-full mb-2"
          onChange={e=>setUsername(e.target.value)}
        />

        <input placeholder="password"
          type="password"
          className="border p-2 w-full mb-4"
          onChange={e=>setPassword(e.target.value)}
        />

        <button onClick={login} className="bg-blue-500 text-white w-full p-2">
          Login
        </button>
      </div>

    </div>
  )
}
