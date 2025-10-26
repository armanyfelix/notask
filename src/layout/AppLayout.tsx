import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Titlebar from "./TitleBar";
import Dock from "./Dock";
import { useState } from "react";
import { documentDir } from "@tauri-apps/api/path";
import CreateFolderModal from "@/components/CreateFolderModal";
import CreateHubModal from "@/components/CreateHubModal";

const getAppDir = async () => {
  try {
    const dir = await documentDir();
    console.log("Directorio de la app:", dir);
  } catch (error) {
    console.error("Error al obtener directorio:", error);
  }
};

export default function AppLayout() {
  const [createHubOpen, setCreateHubOpen] = useState<boolean>(true);

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      <Titlebar />
      <div className="flex h">
        <Sidebar />
        <div className="w-full overflow-auto border-l border-neutral bg-base-200pr-1">
          <Navbar />
          <Outlet />
        </div>
      </div>
      <Dock />
      <CreateHubModal
        isOpen={createHubOpen}
        setOpen={() => setCreateHubOpen(false)}
      />
    </main>
  );
}
