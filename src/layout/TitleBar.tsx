import UserDropdown from "@/components/UserDropdown";
import { useSessionStore } from "@/utils/zustand";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import WindowButtons from "./WindowButtons";

export default function Titlebar() {
  const appWindow = getCurrentWindow();
  const { session } = useSessionStore();

  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState("");

  const tabs = ["tab A", "tableta B", " pestana C", "random shit D"];

  useEffect(() => {
    function handleResize() {
      appWindow.isMaximized().then((newState) => setIsMaximized(newState));
    }
    handleResize();

    const unlisten = appWindow.listen("tauri://resize", async () => {
      handleResize();
    });
    return () => {
      unlisten.then((u) => u());
    };
  }, []);

  return (
    <div className="sticky top-0 bottom-0 right-0 left-0 h-10 bg-base-100 z-[999999]">
      <div className="flex items-start">
        <Button className="btn btn-ghost btn-sm mt-1 ml-1 btn-square">
          <span className="icon-[tabler--menu-2] size-4"></span>
        </Button>
        <div className="tabs tabs-lift bg-transparent ml-1.5 shrink-0">
          {tabs.map((tab) => (
            <label
              className="tab [--tab-bg:var(--color-base-200)] group"
              key={tab}
            >
              <input
                type="radio"
                key={tab}
                onClick={() => setActiveTab(tab)}
                name="my_tabs"
                className=""
                aria-label={tab}
              />
              <span className="ml-4.5">{tab}</span>
              <Button className="invisible group-hover:visible btn btn-square btn-ghost btn-xs -mr-1">
                <span className="icon-[tabler--x]"></span>
              </Button>
            </label>
          ))}
        </div>
        <div
          data-tauri-drag-region
          id="titlebar"
          className="w-full min-w-10 h-8"
        ></div>
        <div className="disabled">
          <UserDropdown session={session} />
        </div>
        <WindowButtons />
      </div>
    </div>
  );
}
