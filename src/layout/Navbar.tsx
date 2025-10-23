import { useState } from "react";
import PlusIcon from "../assets/svgs/plus.svg?react";
import HamburgerIcon from "../assets/svgs/hamburger.svg?react";
import ToggleRightIcon from "../assets/svgs/toggleRight.svg?react";
import ToggleLeftIcon from "../assets/svgs/toggleLeft.svg?react";
import {
  useAccountStore,
  useSidebarStore,
  useSpacesStore,
} from "../utils/zustand";
import { Button } from "react-aria-components";
import NotificationsDialog from "./NotificationsDialog";
import CreateModal from "@/components/CreateModal";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function Navbar() {
  const { WideSidebar, setWideSidebar } = useSidebarStore();
  const { account } = useAccountStore();
  const { spaces, setSpaces } = useSpacesStore();

  return (
    <header className="sticky top-0 right-0 p-1 z-50 flex h-10 bg-base-100 border-b border-neutral justify-between">
      <div className="flex items-center overflow-hidden space-x-2 pl-1">
        <Button
          onPress={() => setWideSidebar(!WideSidebar)}
          className="btn btn-square btn-ghost btn-sm"
        >
          {!WideSidebar ? (
            <span className="icon-[tabler--layout-sidebar-left-expand] h-7 w-7"></span>
          ) : (
            <span className="icon-[tabler--layout-sidebar-left-collapse] h-7 w-7"></span>
          )}
        </Button>
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--arrow-left] h-6 w-6"></span>
        </Button>
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--arrow-right] h-6 w-6"></span>
        </Button>
        <Breadcrumbs />
      </div>
      <div className="flex items-center overflow-hidden space-x-2 pl-1">
        <CreateModal
          accountId={account?.id}
          setSpaces={setSpaces}
          spaces={spaces}
        />
        <NotificationsDialog />
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--layout-columns] h-6 w-6"></span>
        </Button>
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--arrows-diagonal] h-6 w-6"></span>
          <span className="hidden icon-[tabler--arrows-diagonal-minimize] h-6 w-6"></span>
        </Button>
      </div>
    </header>
  );
}
