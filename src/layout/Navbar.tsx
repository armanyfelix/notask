import {
  useAccountStore,
  useSidebarStore,
  useSpacesStore,
} from "../utils/zustand";
import { Button } from "react-aria-components";
import { twMerge } from "tailwind-merge";

export default function Navbar() {
  const { closeSidebar, setCloseSidebar } = useSidebarStore();
  const { account } = useAccountStore();
  const { spaces, setSpaces } = useSpacesStore();

  return (
    <header className="sticky top-0 right-0 z-50 flex h-8.5 bg-base-200 border-b border-neutral justify-between">
      <div className="flex items-center overflow-hidden space-x-1">
        <div
          className={twMerge(
            "transition-all ",
            closeSidebar ? "-translte-x-10" : "translate-x-0 duration-700",
          )}
        >
          {/*<Button
            onPress={() => setCloseSidebar(!closeSidebar)}
            className="btn btn-square btn-ghost btn-sm"
          >*/}
          <label className="swap swap-flip btn btn-square pt-1.5 btn-sm btn-ghost">
            <input
              type="checkbox"
              onClick={() => setCloseSidebar(!closeSidebar)}
            />
            <div className="swap-on">
              <span className="icon-[tabler--layout-sidebar-left-collapse] size-6"></span>
            </div>
            <div className="swap-off">
              <span className="icon-[tabler--layout-sidebar-left-expand] size-6"></span>
            </div>
          </label>
          {/*{!closeSidebar ? (
              <span className="icon-[tabler--layout-sidebar-left-expand] size-6"></span>
            ) : (
              <span className="icon-[tabler--layout-sidebar-left-collapse] size-6"></span>
            )}*/}
          {/*</Button>*/}
        </div>

        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--arrow-left] size-5"></span>
        </Button>
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--arrow-right] size-6"></span>
        </Button>
        <div className="breadcrumbs text-xs pl-2">
          <ul>
            <li>
              <a>
                <span className="icon-[tabler--folder]"></span>
                Home
              </a>
            </li>
            <li>
              <a>
                <span className="icon-[tabler--folder]"></span>
                Documents
              </a>
            </li>
            <li>
              <a>
                <span className="icon-[tabler--file]"></span>
                File.txt
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex items-center overflow-hidden space-x-1 pl-1">
        {/*<CreateModal
          accountId={account?.id}
          setSpaces={setSpaces}
          spaces={spaces}
        />
        <NotificationsDialog />*/}
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--plus] size-5"></span>
        </Button>
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--search] size-5"></span>
        </Button>
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--layout-columns] size-5"></span>
        </Button>
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--arrows-diagonal] size-5"></span>
          <span className="hidden icon-[tabler--arrows-diagonal-minimize] size-5"></span>
        </Button>
      </div>
    </header>
  );
}
