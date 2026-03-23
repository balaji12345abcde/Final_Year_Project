import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/api";

export default function RegisterPage() {

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerUser(form);
      navigate("/");
    } catch {
      alert("Error");
    }
  };

  return (
    <div className="bg-main h-screen flex items-center justify-center">

      <div className="glass p-8 w-80 text-white shadow-xl">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Register
        </h2>

        <input
          placeholder="Username"
          className="w-full p-2 mb-3 rounded bg-white/20 text-white"
          onChange={(e)=>setForm({...form,username:e.target.value})}
        />

        <input
          placeholder="Email"
          className="w-full p-2 mb-3 rounded bg-white/20 text-white"
          onChange={(e)=>setForm({...form,email:e.target.value})}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded bg-white/20 text-white"
          onChange={(e)=>setForm({...form,password:e.target.value})}
        />

        <button
          onClick={handleRegister}
          className="w-full py-2 rounded bg-white/30 hover:bg-white/40"
        >
          Register
        </button>

        <p className="text-sm mt-4 text-center">
          Already have account?{" "}
          <Link to="/" className="underline">Login</Link>
        </p>

      </div>
    </div>
  );
}