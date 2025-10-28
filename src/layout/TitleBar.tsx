import UserDropdown from "@/components/UserDropdown";
import { useSessionStore } from "@/utils/zustand";
import { useEffect, useState } from "react";
import { Button } from "react-aria-components";
import WindowButtons from "./WindowButtons";
import { load } from "@tauri-apps/plugin-store";

export default function Titlebar() {
  const { session } = useSessionStore();

  const [activeTab, setActiveTab] = useState("");
  const [hubs, setHubs] = useState([]);
  const [currentHub, setCurrentHub] = useState();

  const tabs = ["tab A", "tableta B", " pestana C", "random shit D"];

  const getHubs = async () => {
    try {
      const hubsStore = await load("hubs.json");
      const hubsLength = await hubsStore.length();
      if (!hubsStore === null || hubsLength > 0) {
        const keys: any = await hubsStore.keys();
        setHubs(keys);
        const defaultsStore = await load("defaults.json");
        const defaultHub: any = await defaultsStore.get("hub");
        console.log(defaultHub);
        setCurrentHub(defaultHub);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getHubs();
  }, []);

  return (
    <div className="sticky top-0 bottom-0 right-0 left-0 h-8 bg-base-100">
      <div className="flex items-center">
        <Button className="btn btn-ghost btn-sm">{currentHub}</Button>
        <div className="tabs tabs-lift tabs-sm bg-transparent ml-1.5 shrink-0">
          {tabs.map((tab) => (
            <label className="tab [--tab-bg:var(--color-base-200)] group" key={tab}>
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
        <div data-tauri-drag-region id="titlebar" className="w-full min-w-10 h-8"></div>
        <div className="mr-26">
          <UserDropdown session={session} />
        </div>
        <WindowButtons />
      </div>
    </div>
  );
}
