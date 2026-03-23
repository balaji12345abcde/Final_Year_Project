import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {

  const location = useLocation();
  const docId = localStorage.getItem("docId") || "1";

  const menu = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Upload", path: "/upload" },
    { name: "Summary", path: `/summary/${docId}` },
    { name: "Acts", path: `/acts/${docId}` },
    { name: "Risk", path: `/risk/${docId}` },
    { name: "NER", path: `/ner/${docId}` },
    { name: "Chatbot", path: "/chatbot" }
  ];

  return (
    <div className="w-64 h-screen bg-main p-4 text-white">

      <div className="glass p-4 h-full flex flex-col">

        <h1 className="text-xl font-bold mb-10">
          ⚖ SMART LEGAL AI
        </h1>

        <nav className="space-y-2 flex-1">

          {menu.map((item, i) => {

            const active = location.pathname === item.path;

            return (
              <Link
                key={i}
                to={item.path}
                className={`block px-4 py-2 rounded ${
                  active
                    ? "bg-white text-purple-700 font-semibold"
                    : "hover:bg-white/20"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

        </nav>

        <p className="text-sm opacity-70">
          © 2026 Legal AI
        </p>

      </div>
    </div>
  );
}