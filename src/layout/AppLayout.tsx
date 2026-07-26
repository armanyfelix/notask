import { useEffect, useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from "react-aria-components";
import { Link, Outlet } from "react-router-dom";
import CreateMenu from "@/components/CreateMenu";
import UserDropdown from "@/components/UserDropdown";
import {
  useAccountStore,
  useSessionStore,
  useSpacesStore,
  useTabsStore,
} from "@/utils/zustand";
import isTauri from "@/utils/isTauri";
import Sidebar from "./Sidebar";
import WindowButtons from "./WindowButtons";

export default function AppLayout() {
  const { session } = useSessionStore();
  const { tabs, setTabs, selectedTab, setSelectedTab } = useTabsStore();
  const { account } = useAccountStore();
  const { spaces, setSpaces } = useSpacesStore();
  const [isMaximized, setIsMaximized] = useState(false);
  const [vaults, setVaults] = useState<string[]>([]);
  const [currentVault, setCurrentVault] = useState<string>();

  const getVaults = async () => {
    if (!isTauri) return;

    try {
      const [{ load }, { migrateHubsToVaults }] = await Promise.all([
        import("@tauri-apps/plugin-store"),
        import("@/utils/vaults"),
      ]);
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
    getTabs();

    if (isTauri) {
      getVaults();
      import("@tauri-apps/api/window").then(({ getCurrentWindow }) => {
        getCurrentWindow()
          .isMaximized()
          .then((newState) => setIsMaximized(newState));
      });
    }
  }, []);

  function onOpenTab(tab: any) {
    setSelectedTab(tab);
  }

  return (
    <main
      id="app"
      className="h-screen flex flex-col overflow-hidden bg-base-100/45"
    >
      <div
        className={`sticky top-0 bottom-0 right-0 left-0 h-8 bg-base-30 flex pl-5 pr-20 items-center ${!isMaximized && "rounded-tr-xl"}`}
      >
        <MenuTrigger>
          <Button aria-label="Menu" className="btn btn-square btn-ghost btn-sm">
            {currentVault}
          </Button>
          <Popover placement="bottom left">
            <Menu className="dialog menu">
              <MenuItem onAction={() => {}}>
                <li>
                  <Button className="whitespace-nowrap">
                    <span className="icon-[solar--file-smile-line-duotone] size-5"></span>
                    Note
                  </Button>
                </li>
              </MenuItem>
              <MenuItem onAction={() => alert("open")}>
                <li>
                  <Button className="whitespace-nowrap">
                    <span className="icon-[solar--clipboard-add-line-duotone] size-5"></span>
                    List
                  </Button>
                </li>
              </MenuItem>
              <MenuItem onAction={() => alert("open")}>
                <li>
                  <Button className="whitespace-nowrap">
                    <span className="icon-[solar--add-folder-line-duotone] size-5"></span>
                    Folder
                  </Button>
                </li>
              </MenuItem>
              <MenuItem onAction={() => alert("open")}>
                <li>
                  <Button className="whitespace-nowrap">
                    <span className="icon-[solar--planet-line-duotone] size-5"></span>
                    Space
                  </Button>
                </li>
              </MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
        <div
          role="tablist"
          aria-label="Tabs"
          className="tabs tabs-lift flex-nowrap tabs-sm bg-transparent ml-1.5 flex-1"
        >
          {tabs.map((item: any, i: number) => (
            <Link
              key={i}
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
        <CreateMenu
          accountId={account?.id}
          setSpaces={setSpaces}
          spaces={spaces}
        />
        <div className="flex w-full items-center">
          <div data-tauri-drag-region className="w-full min-w-10 h-8"></div>
          <UserDropdown session={session} />
          <WindowButtons />
        </div>
      </div>
      <div className="flex h">
        <Sidebar />
        <div className="w-full overflow-auto border-l border-neutral/60 bg-base-200/55 pr-1">
          {/*<Navbar />*/}
          <Outlet />
        </div>
      </div>
    </main>
  );
}
