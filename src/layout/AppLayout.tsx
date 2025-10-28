import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Titlebar from "./TitleBar";
import Dock from "./Dock";
import { Button, Collection, Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import {
  useAccountStore,
  useSessionStore,
  useSidebarStore,
  useSpacesStore,
} from "@/utils/zustand";
import { useEffect, useState } from "react";
import { load } from "@tauri-apps/plugin-store";
import UserDropdown from "@/components/UserDropdown";
import WindowButtons from "./WindowButtons";
import CreateModal from "@/components/CreateModal";
import { twMerge } from "tailwind-merge";
import { createHideableComponent } from "@react-aria/collections";

export default function AppLayout() {
  const { session } = useSessionStore();

  const [activeTab, setActiveTab] = useState("");
  const [hubs, setHubs] = useState([]);
  const [currentHub, setCurrentHub] = useState();

  const tabs = [
    { id: 1, title: "Mouse settings" },
    { id: 2, title: "Keyboard settings" },
    { id: 3, title: "Gamepad settings" },
  ];

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
    <main className="h-screen flex flex-col overflow-hidden">
      <Tabs className="">
        <div className="sticky top-0 bottom-0 right-0 left-0 h-8 bg-base-100 flex  items-center">
          <Button className="btn btn-ghost btn-sm">{currentHub}</Button>
          <TabList
            aria-label="Tabs"
            className="tabs tabs-lift flex-nowrap tabs-sm bg-transparent ml-1.5 flex-1"
            items={tabs}
          >
            {(item) => (
              <Tab
                id={item.id}
                key={item.id}
                className="tab flex-nowrap [--tab-bg:var(--color-base-200)] group"
                onPress={() => onOpenTab(item)}
              >
                <span className="ml-2 text-nowrap">{item.title}</span>
                <Button className="invisible group-hover:visible btn btn-square btn-ghost btn-xs -mr-1">
                  <span className="icon-[tabler--x]"></span>
                </Button>
              </Tab>
            )}
          </TabList>
          <div className="flex w-full items-center">
            <div data-tauri-drag-region className="w-full min-w-10 h-8"></div>
            <UserDropdown session={session} />
            <WindowButtons />
          </div>
        </div>
        <div className="flex h">
          <Sidebar />
          <div className="w-full overflow-auto border-l border-neutral bg-base-200pr-1">
            <Navbar />
            <Collection items={tabs}>
              {(item) => (
                <TabPanel>
                  <Outlet />
                </TabPanel>
              )}
            </Collection>
          </div>
        </div>
      </Tabs>
    </main>
  );
}
