import { load } from "@tauri-apps/plugin-store";
import { useEffect, useState } from "react";
import { Button, Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import UserDropdown from "@/components/UserDropdown";
import { useSessionStore } from "@/utils/zustand";
import WindowButtons from "./WindowButtons";
import { migrateHubsToVaults } from "@/utils/vaults";

export default function Titlebar() {
  const { session } = useSessionStore();

  const [activeTab, setActiveTab] = useState("");
  const [vaults, setVaults] = useState<string[]>([]);
  const [currentVault, setCurrentVault] = useState<string>();

  const tabs = ["tab A", "tableta B", " pestana C", "random shit D"];

  const getVaults = async () => {
    try {
      const vaultsStore = await migrateHubsToVaults();
      if ((await vaultsStore.length()) > 0) {
        const keys = await vaultsStore.keys();
        setVaults(keys);
        const defaultsStore = await load("defaults.json");
        const defaultVault = await defaultsStore.get<string>("vault");
        setCurrentVault(defaultVault ?? keys[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVaults();
  }, []);

  function onOpenTab(tab: any) {}

  return (
    <div id="titlebar" className="sticky top-0 bottom-0 right-0 left-0 h-7">
      <div className="flex items-center">
        <div>
          <Button className="btn btn-ghost btn-sm">{currentVault}</Button>
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
          <div
            data-tauri-drag-region
            id="titlebar"
            className="w-f min-w-10 h-7"
          ></div>
          <UserDropdown session={session} />
        </div>
        <WindowButtons />
      </div>
    </div>
  );
}
