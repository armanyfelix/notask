import { useSidebarsStore } from "../utils/zustand";
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from "react-aria-components";

export default function Navbar() {
  const {
    rightSidebarOpen,
    setRightSidebarOpen,
    leftSidebarOpen,
    setLeftSidebarOpen,
  } = useSidebarsStore();

  return (
    <header className="sticky top-0 right-0 z-50 flex h-8.5 bg-base-200 border-b border-neutral justify-between">
      <div className="flex items-center overflow-hidden space-x-1">
        <div
        // className={twMerge(
        //   "transition-all ",
        //   rightSidebarOpen ? "-translate-x-10" : "translate-x-0 duration-700",
        // )}
        >
          <label className="swap swap-flip btn btn-square pt-1.5 btn-sm btn-ghost">
            <input
              type="checkbox"
              checked={leftSidebarOpen}
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            />
            <div className="swap-on">
              <span className="icon-[tabler--layout-sidebar-left-collapse] size-6"></span>
            </div>
            <div className="swap-off">
              <span className="icon-[tabler--layout-sidebar-left-expand] size-6"></span>
            </div>
          </label>
        </div>

        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--arrow-left] size-5"></span>
        </Button>
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--arrow-right] size-5"></span>
        </Button>
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--home] size-5"></span>
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
        {/*<NotificationsDialog />*/}
        {/*<Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--plus] size-5"></span>
        </Button>*/}
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--search] size-5"></span>
        </Button>
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--share-3] size-5"></span>
        </Button>
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--layout-columns] size-5"></span>
        </Button>
        <Options />
        {/*<div
        className={twMerge(
           "transition-all ",
           rightSidebarOpen ? "translte-x-10" : "-translate-x-0 duration-700",
         )}
         >*/}
        <label className="swap swap-flip btn btn-square pt-1.5 btn-sm btn-ghost">
          <input
            type="checkbox"
            checked={rightSidebarOpen}
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          />
          <div className="swap-on">
            <span className="icon-[tabler--layout-sidebar-right-expand] size-6"></span>
          </div>
          <div className="swap-off">
            <span className="icon-[tabler--layout-sidebar-right-collapse] size-6"></span>
          </div>
        </label>
        {/*</div>*/}
      </div>
    </header>
  );
}

function Options() {
  return (
    <MenuTrigger>
      <Button aria-label="Menu" className="btn btn-square btn-ghost btn-sm">
        <span className="icon-[tabler--dots] size-5"></span>
      </Button>
      <Popover placement="bottom right">
        <Menu className="dialog menu">
          <MenuItem onAction={() => {}}>
            <li>
              <Button className="whitespace-nowrap">
                <span className="icon-[solar--file-smile-line-duotone] size-5"></span>
                Duplicate
              </Button>
            </li>
          </MenuItem>
          <MenuItem onAction={() => alert("open")}>
            <li>
              <Button className="whitespace-nowrap">
                <span className="icon-[solar--clipboard-add-line-duotone] size-5"></span>
                Move to
              </Button>
            </li>
          </MenuItem>
          <MenuItem onAction={() => alert("open")}>
            <li>
              <Button className="whitespace-nowrap">
                <span className="icon-[solar--add-folder-line-duotone] size-5"></span>
                Archived
              </Button>
            </li>
          </MenuItem>
          <MenuItem onAction={() => alert("open")}>
            <li>
              <Button className="whitespace-nowrap">
                <span className="icon-[solar--planet-line-duotone] size-5"></span>
                Delete
              </Button>
            </li>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}
