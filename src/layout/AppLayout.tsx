import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Titlebar from "./TitleBar";
import Dock from "./Dock";

export default function AppLayout() {
  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <Titlebar />
      <div className="flex h">
        <Sidebar />
        <div className="w-full overflow-auto pr-1">
          <Navbar />
          <Outlet />
        </div>
      </div>
      <Dock />
    </main>
  );
}
