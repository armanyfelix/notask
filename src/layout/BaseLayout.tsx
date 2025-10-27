import { Outlet } from "react-router-dom";
import WindowButtons from "./WindowButtons";

export default function BaseLayout() {
  return (
    <main className="h-screen overflow-hidden">
      <div className="sticky top-0 right-0 bg-transparent left-0 h-8 z-999999 flex items-center">
        <img src="/logo_orange.png" alt="zag" className="w-7 ml-3" />
        <div data-tauri-drag-region className="w-full min-w-10 h-8"></div>
        <WindowButtons />
      </div>
      <div className="">
        <Outlet />
      </div>
    </main>
  );
}
