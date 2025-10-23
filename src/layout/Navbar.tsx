import { useState } from "react";
import PlusIcon from "../assets/svgs/plus.svg?react";
import HamburgerIcon from "../assets/svgs/hamburger.svg?react";
import ToggleRightIcon from "../assets/svgs/toggleRight.svg?react";
import ToggleLeftIcon from "../assets/svgs/toggleLeft.svg?react";
import {
  useAccountStore,
  useSessionStore,
  useSidebarStore,
  useSpacesStore,
} from "../utils/zustand";
import { Button } from "react-aria-components";
import UserDropdown from "@/components/UserDropdown";
import NotificationsDialog from "./NotificationsDialog";
import CreateModal from "@/components/CreateModal";

const tabs = ["A", "B", "C", "D"];

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("");
  const { WideSidebar, setWideSidebar } = useSidebarStore();
  const { account } = useAccountStore();
  const { session } = useSessionStore();
  const { spaces, setSpaces } = useSpacesStore();

  return (
    <header className="sticky top-0 right-0 p-1 z-50 flex justify-between">
      <div className="flex items-center overflow-hidden pl-2">
        <Button
          onPress={() => setWideSidebar(!WideSidebar)}
          className="group btn btn-square btn-ghost btn-sm"
        >
          <HamburgerIcon className="block group-hover:hidden" />
          {!WideSidebar ? (
            <ToggleRightIcon className="hidden h-5 w-5 group-hover:block" />
          ) : (
            <ToggleLeftIcon className="hidden h-5 w-5 group-hover:block" />
          )}
        </Button>
        {tabs.map((tab) => (
          <a
            key={tab}
            href="#"
            onClick={() => setActiveTab(tab)}
            className={`tab-lg tab tabs-bordered ${
              activeTab === tab ? "tab-active bg-base-100 pl-3! pr-2!" : ""
            }`}
          >
            <span className="mr-2">{tab}</span>
            {activeTab === tab ? (
              <Button className="btn btn-circle btn-ghost btn-xs">
                <PlusIcon className="rotate-45" />
              </Button>
            ) : (
              ""
            )}
          </a>
        ))}
      </div>
      <ul className="flex flex-row items-center justify-center">
        <li>
          <CreateModal
            accountId={account?.id}
            setSpaces={setSpaces}
            spaces={spaces}
          />
        </li>
        <li>
          <NotificationsDialog />
        </li>
        <li className="disabled ml-1">
          <UserDropdown session={session} />
        </li>
      </ul>
    </header>
  );
}
