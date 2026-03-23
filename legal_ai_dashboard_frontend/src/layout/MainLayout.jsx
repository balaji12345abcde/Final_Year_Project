import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {

  return (

    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <Navbar />

        {/* 🌈 MAIN BACKGROUND */}
        <div className="flex-1 bg-main p-4 overflow-y-auto">

          {/* 💎 GLASS WRAPPER */}
          <div className="glass p-6 min-h-full">

            {children}

          </div>

        </div>

      </div>

    </div>

  );
}