import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Link, Outlet, useLocation } from "react-router";
import { Button, Collection, Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { useSessionStore, useTabsStore } from "@/utils/zustand";
import { useEffect, useState } from "react";
import { load } from "@tauri-apps/plugin-store";
import UserDropdown from "@/components/UserDropdown";
import WindowButtons from "./WindowButtons";

export default function AppLayout() {
  const { session } = useSessionStore();
  const { tabs, setTabs, selectedTab, setSelectedTab } = useTabsStore();
  let { pathname } = useLocation();

  const [hubs, setHubs] = useState([]);
  const [currentHub, setCurrentHub] = useState();

  const getHubs = async () => {
    try {
      const hubsStore = await load("hubs.json");
      const hubsLength = await hubsStore.length();
      if (!hubsStore === null || hubsLength > 0) {
        const keys: any = await hubsStore.keys();
        setHubs(keys);
        const defaultsStore = await load("defaults.json");
        const defaultHub: any = await defaultsStore.get("hub");
        setCurrentHub(defaultHub);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getTabs = async () => {
    // const tabsStore = await load("tabs.json");
    // const tabsLength = await tabsStore.length();
    if (tabs.length <= 0) {
      // const values: any = await tabsStore.values();
      // console.log(values);
      // setTabs(values);
      // const defaultsStore = await load("defaults.json");
      // const defaultTab: any = await defaultsStore.get("tab");
      // setCurrentTab(defaultTab);
      setTabs([
        {
          title: "new tab",
          path: "/",
        },
      ]);
    }
    // await tabsStore.set("tab 0", {
    //   path: "/",
    //   title: "new tab",
    // });
  };

  useEffect(() => {
    getHubs();
    getTabs();
  }, []);

  function onOpenTab(tab: any) {
    setSelectedTab(tab);
  }

  return (
    <main className="h-screen flex flex-col overflow-hidden">
      {/*<Tabs selectedKey={selectedTab} onSelectionChange={setSelectedTab}>*/}
      <div className="sticky top-0 bottom-0 right-0 left-0 h-8 bg-base-100 flex  items-center">
        <Button className="btn btn-ghost btn-sm">{currentHub}</Button>
        <div
          role="tablist"
          aria-label="Tabs"
          className="tabs tabs-lift flex-nowrap tabs-sm bg-transparent ml-1.5 flex-1"
        >
          {tabs.map((item: any) => (
            <Link
              role="tab"
              to={item.path}
              className={`tab flex-nowrap [--tab-bg:var(--color-base-200)] group outline-none ${selectedTab.path === item.path && "tab-active"}`}
              onClick={() => onOpenTab(item)}
            >
              <span className="ml-2 text-nowrap">{item.title}</span>
              <Button className="invisible group-hover:visible btn btn-square btn-ghost btn-xs -mr-1">
                <span className="icon-[tabler--x]"></span>
              </Button>
            </Link>
          ))}
        </div>
        <div className="flex w-full items-center">
          <div data-tauri-drag-region className="w-full min-w-10 h-8"></div>
          {/*<UserDropdown session={session} />*/}
          <WindowButtons />
        </div>
      </div>
      <div className="flex h">
        <Sidebar />
        <div className="w-full overflow-auto border-l border-neutral bg-base-200pr-1">
          <Navbar />
          {/*<Collection items={tabs}>*/}
          {/*{(item) => (*/}
          {/*// <TabPanel id={pathname}>*/}
          <Outlet />
          {/*// </TabPanel>*/}
          {/*)}*/}
          {/*</Collection>*/}
        </div>
      </div>
      {/*</Tabs>*/}
    </main>
  );
}
