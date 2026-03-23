import { useNavigate } from "react-router-dom";

export default function Navbar() {

  const navigate = useNavigate();
  const user = localStorage.getItem("user") || "User";

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (

    <div className="px-3 bg-blue-600 py-3 glass flex justify-between items-center text-white">

      {/* LEFT TITLE */}
      <h2 className="font-semibold text-lg tracking-wide">
        ⚖ SMART LEGAL AI
      </h2>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4">

        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/30">
          <img
            src="https://i.pravatar.cc/100"
            alt="user"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Username */}
        <span className="text-white/90 font-medium">
          {user}
        </span>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="bg-red-500/80 hover:bg-red-600 px-4 py-1 rounded-lg text-sm transition-all duration-200 shadow-md"
        >
          Logout
        </button>

      </div>

    </div>

  );
}