import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {

  return (

    <div className="flex h-screen overflow-hidden">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <div className="flex-1 bg-main p-4 overflow-y-auto">

          <div className="glass p-6 min-h-full rounded-2xl">

            {children}

          </div>

        </div>

      </div>

    </div>

  );
}