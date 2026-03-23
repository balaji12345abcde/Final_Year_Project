import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";

export default function LoginPage() {

  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser(form.username, form.password);
      localStorage.setItem("token", res.access);
      localStorage.setItem("user", form.username);
      navigate("/dashboard");
    } catch {
      alert("Invalid login");
    }
  };

  return (
    <div className="bg-main h-screen flex items-center justify-center">

      <div className="glass p-8 w-80 text-white shadow-xl">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          placeholder="Username"
          className="w-full p-2 mb-4 rounded bg-white/20 text-white placeholder-white border border-white/30"
          onChange={(e)=>setForm({...form,username:e.target.value})}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 rounded bg-white/20 text-white placeholder-white border border-white/30"
          onChange={(e)=>setForm({...form,password:e.target.value})}
        />

        <button
          onClick={handleLogin}
          className="w-full py-2 rounded bg-white/30 hover:bg-white/40"
        >
          Login
        </button>

        <p className="text-sm mt-4 text-center">
          Don't have account?{" "}
          <Link to="/register" className="underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}