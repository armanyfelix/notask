import UserDropdown from "@/components/UserDropdown";
import { useSessionStore } from "@/utils/zustand";
import { useEffect, useState } from "react";
import { Button, Tab, TabList, TabPanel, Tabs } from "react-aria-components";
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

  function onOpenTab(tab: any) {}

  return (
    <div className="sticky top-0 bottom-0 right-0 left-0 h-8 bg-base-100">
      <div className="flex items-center">
        <Button className="btn btn-ghost btn-sm">{currentHub}</Button>
        <Tabs className="">
          <TabList
            aria-label="History of Ancient Rome"
            className="tabs tabs-lift flex-nowrap tabs-sm bg-transparent ml-1.5"
          >
            {tabs.map((tab) => (
              <Tab
                id={tab}
                key={tab}
                className="tab flex-nowrap [--tab-bg:var(--color-base-200)] group"
                onPress={() => onOpenTab(tab)}
              >
                <span className="ml-2 text-nowrap">{tab}</span>
                <Button className="invisible group-hover:visible btn btn-square btn-ghost btn-xs -mr-1">
                  <span className="icon-[tabler--x]"></span>
                </Button>
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <div data-tauri-drag-region id="titlebar" className="w-full min-w-10 h-8"></div>
        <div className="">
          <UserDropdown session={session} />
        </div>
        <WindowButtons />
      </div>
    </div>
  );
}
