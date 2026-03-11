
import { useState } from "react"
import api from "../api/api"

export default function Register(){

  const [username,setUsername]=useState("")
  const [password,setPassword]=useState("")

  const register = async ()=>{

    await api.post("/register/",{username,password})

    alert("Registered")
  }

  return(
    <div className="flex items-center justify-center h-screen">

      <div className="bg-white p-6 shadow w-80">
        <h2 className="text-xl mb-4">Register</h2>

        <input placeholder="username"
          className="border p-2 w-full mb-2"
          onChange={e=>setUsername(e.target.value)}
        />

        <input placeholder="password"
          type="password"
          className="border p-2 w-full mb-4"
          onChange={e=>setPassword(e.target.value)}
        />

        <button onClick={register} className="bg-green-500 text-white w-full p-2">
          Register
        </button>

      </div>

    </div>
  )
}
