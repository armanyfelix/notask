import UserDropdown from '../components/UserDropdown'
import BellIcon from '../assets/svgs/BellIcon'
import MagniferIcon from '../assets/svgs/magnifer.svg?react'
import { signal } from '@preact/signals-react'
import PlusIcon from '../assets/svgs/plus.svg?react'
import HamburgerIcon from '../assets/svgs/hamburger.svg?react'
import ToggleRightIcon from '../assets/svgs/toggleRight.svg?react'
import ToggleLeftIcon from '../assets/svgs/toggleLeft.svg?react'
import CreateModal from '../components/CreateModal'
import { UIState, useSessionStore, useUIStore } from '../utils/zustand'
import NotificationsDialog from './NotificationsDialog'

const activeTab = signal('')
const tabs = ['A', 'B', 'C', 'D']
export default function Navbar() {
  const { openExplorer, setOpenExplorer } = useUIStore((s: UIState) => s)

  return (
    <header className="sticky top-0 z-50 flex justify-between py-1">
      <div className="flex items-center overflow-hidden pl-2">
        <button
          onClick={() => setOpenExplorer(!openExplorer)}
          className="group btn btn-square btn-ghost btn-sm"
        >
          <HamburgerIcon className="block group-hover:hidden" />
          {!openExplorer ? (
            <ToggleRightIcon className="hidden h-5 w-5 group-hover:block" />
          ) : (
            <ToggleLeftIcon className="hidden h-5 w-5 group-hover:block" />
          )}
        </button>
        {tabs.map((tab) => (
          <a
            key={tab}
            href="#"
            onClick={() => (activeTab.value = tab)}
            className={`tab-lifted tab-lg tab ${
              activeTab.value === tab
                ? 'tab-active bg-base-100 !pl-3 !pr-2'
                : ''
            }`}
          >
            <span className="mr-2">{tab}</span>
            {activeTab.value === tab ? (
              <button className="btn btn-square btn-ghost btn-xs">
                <PlusIcon />
              </button>
            ) : (
              ''
            )}
          </a>
        ))}
      </div>
    </header>
  )
}
