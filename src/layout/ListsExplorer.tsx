// import AltArrowDownIcon from '../assets/svgs/AltArrowDownIcon'
import SunIcon from '../assets/svgs/sun.svg?react'
import TrashIcon from '../assets/svgs/trash.svg?react'
// import PlusIcon from '../assets/svgs/plus.svg?react'
// import CreateFolderDialog from '../components/CreateFolderDialog'
import UpcomingIcon from '../assets/svgs/upcomingCalendar.svg?react'
import CompleteIcon from '../assets/svgs/complete.svg?react'
import { Link } from 'react-router-dom'
// import { signal } from '@preact/signals'

// const openCreateFolder = signal<boolean>(false)
export default function ListsExplorer() {
  return (
    <>
      <div className="flex flex-col justify-between">
        <ul className="menu">
          <li>
            <Link to="/today" className="">
              <SunIcon />
              Today
            </Link>
          </li>
          <li>
            <Link to="/upcoming" className="">
              <UpcomingIcon />
              Upcoming
            </Link>
          </li>
        </ul>
        <div className="divider my-0"></div>
        <div className="max-h-[69vh] overflow-y-auto">
          {/* <button
            type="button"
            onClick={() => {
              toggleFolders.value = !toggleFolders.value
            }}
            className="group flex w-full items-center justify-between hover:bg-base-300"
          >
            <div className="ml-1 flex items-center">
              <span
                className={`${
                  !toggleFolders.value && '-rotate-90'
                } duration-100 ease-in`}
              >
                <AltArrowDownIcon />
              </span>
              <span className="ml-1">Lists</span>
            </div>
            <div className="opacity-0 group-hover:opacity-100">
              <button
                className="btn btn-square btn-ghost btn-xs m-1 outline-none"
                onClick={(e) => {
                  e.stopPropagation()
                  openCreateFolder.value = !openCreateFolder.value
                }}
              >
                <PlusIcon />
              </button>
            </div>
          </button> */}
          {/* {toggleFolders.value && <FileTree />}{' '} */}
          {/* <button
            type="button"
            onClick={() => {
              toggleSpaces.value = !toggleSpaces.value
            }}
            className="group flex w-full items-center justify-between hover:bg-base-300"
          > */}
          {/* <div className="ml-1 flex items-center"> */}
          {/* <span
                className={`${
                  !toggleSpaces.value && '-rotate-90'
                } duration-100 ease-in`}
              >
                <AltArrowDownIcon />
              </span> */}
          {/* <span className="ml-1">Spaces</span> */}
          {/* </div> */}
          {/* <div className="opacity-0 group-hover:opacity-100">
              <button
                className="btn btn-square btn-ghost btn-xs m-1 outline-none"
                onClick={(e) => {
                  e.stopPropagation()
                  openCreateFolder.value = !openCreateFolder.value
                }}
              >
                <PlusIcon />
              </button>
            </div> */}
          {/* </button> */}
          {/* {toggleSpaces.value && <FileTree />}
          {toggleSpaces.value && <FileTree />}
          {toggleSpaces.value && <FileTree />} */}
        </div>
        <div className="divider my-0"></div>
        <ul className="menu">
          <li>
            <a href="/tasks/today" className="">
              <CompleteIcon />
              Complete
            </a>
          </li>
          <li>
            <a href="/tasks/upcoming" className="">
              <TrashIcon />
              Trash
            </a>
          </li>
        </ul>
      </div>
      {/* <CreateFolderDialog open={openCreateFolder} /> */}
    </>
  )
}
