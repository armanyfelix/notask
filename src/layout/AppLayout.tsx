import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Titlebar from "./TitleBar";

export default function AppLayout() {
  return (
    <main className="">
      <Titlebar />
      {/*<div className="flex h">
        <Sidebar />
        <div className=" w-full overflow- bg-base-200 pr-1">
          <Navbar />
          <Outlet />
        </div>
      </div>*/}
    </main>
  );
}
