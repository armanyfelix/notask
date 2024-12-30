import TrashIcon from '../assets/svgs/trash.svg?react'
import PlusIcon from '../assets/svgs/plus.svg?react'
import DotsIcon from '../assets/svgs/dotsBold.svg?react'
import AddFolderIcon from '../assets/svgs/addFolder.svg?react'
import AddFileIcon from '../assets/svgs/addFile.svg?react'
import AddListIcon from '../assets/svgs/addList.svg?react'
import { signal } from '@preact/signals-react'
import supabase from '../utils/supabase'
import { Fragment, useEffect } from 'react'
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from 'react-aria-components'
import CreateFolderModal from '../components/CreateFolderModal'
import CreateListModal from '../components/CreateListModal'
import { Link } from 'react-router-dom'

interface Props {
  space: any
  account: any
  setAccount: any
}

type Element = {
  id: number
  name: string
  folder: number
  space: number
  type: 'list' | 'note' | 'folder'
}

// const example = [
//   {
//     type: 'folder',
//     name: 'folder 1',
//     id: 1,
//     content: [],
//   },
//   {
//     type: 'list',
//     name: 'list 1',
//     id: 2,
//   },
//   {
//     type: 'folder',
//     name: 'folder 2',
//     content: [
//       {
//         type: 'note',
//         name: 'note 1',
//         id: 4,
//       },
//       {
//         type: 'list',
//         name: 'list in folder 1',
//         id: 3,
//       },
//     ],
//   },
//   {
//     type: 'folder',
//     name: 'folder 3',
//     content: [
//       {
//         type: 'list',
//         name: 'lis in folder 2',
//         id: 5,
//       },
//       {
//         type: 'folder',
//         name: 'folder in folder 1',
//         id: 6,
//         content: [
//           {
//             type: 'folder',
//             name: 'folder in folder in folder',
//             id: 7,
//           },
//           {
//             type: 'note',
//             name: 'note in folder in folder',
//             id: 8,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     type: 'note',
//     name: 'note 5',
//     id: 9,
//   },
//   {
//     type: 'folder',
//     name: 'folder 4',
//     content: [],
//   },
// ]

const openCreateFolder = signal<boolean>(false)
const openCreateList = signal<boolean>(false)
const loading = signal<boolean>(false)
const parent = signal<any>(null)
const elements = signal<any>(null)

export default function SpaceExplorer({ space, account, setAccount }: Props) {
  async function getData() {
    console.log('20milli')
    loading.value = true
    const { data, error }: { data: any; error: any } = await supabase
      .from('space_data')
      .select('*')
      .eq('space', space.value.id)

    console.log('data :>> ', data)
    console.log('error :>> ', error);
    if (data) {
      elements.value = data
    }

    loading.value = false
  }

  useEffect(() => {
    console.log('space :>> ', space.value);
    getData()
  }, [space.value])

  return (
    <>
      <Header space={space} />
      <ElementsTree space={space} />
      <CreateFolderModal
        open={openCreateFolder}
        parent={parent}
        account={account}
        getData={getData}
      />
      <CreateListModal
        open={openCreateList}
        parent={parent}
        account={account}
        setAccount={setAccount}
        getData={getData}
      />
    </>
  )
}

const Header = ({ space }: any) => {
  return (
    <header className="group z-0 flex items-center justify-between px-4">
      <h3 className="text-xl font-bold capitalize">{space.value.name}</h3>
      <div className="inline-flex">
        <MenuTrigger>
          <Button
            aria-label="create element on space"
            className={`btn btn-square btn-ghost btn-xs`}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
          <Popover>
            <Menu className="dialog menu menu-sm">
              <MenuItem
                onAction={() => {
                  openCreateFolder.value = true
                  parent.value = {
                    type: 'space',
                    id: space.value.id,
                  }
                }}
              >
                <li>
                  <Button className="whitespace-nowrap">
                    <AddFolderIcon className="h-4 w-4" />
                    Add Folder
                  </Button>
                </li>
              </MenuItem>
              <MenuItem
                onAction={() => {
                  openCreateList.value = true
                  parent.value = {
                    type: 'space',
                    id: space.value.id,
                  }
                }}
              >
                <li>
                  <Button className="whitespace-nowrap">
                    <AddListIcon className="h-4 w-4" />
                    Add List
                  </Button>
                </li>
              </MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
        <MenuTrigger>
          <Button className={`btn btn-square btn-ghost btn-xs`}>
            <DotsIcon className="h-4 w-4" />
          </Button>
          <Popover>
            <Menu className="dialog menu menu-sm">
              <MenuItem>
                <li>
                  <button className="whitespace-nowrap">Edit</button>
                </li>
              </MenuItem>
              <MenuItem>
                <li>
                  <button className="whitespace-nowrap text-error">
                    <TrashIcon className="h-5 w-5" />
                    Delete
                  </button>
                </li>
              </MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      </div>
    </header>
  )
}

const ElementsTree = ({ space }: any) => {
  // loading.value ? (
  //   <div className="mt-5 space-y-3 px-3">
  //     <div className="skeleton h-4 w-28"></div>
  //     <div className="skeleton h-4 w-44"></div>
  //     <div className="skeleton h-4 w-36"></div>
  //   </div>
  // ) :
  return  (
    <ul className="menu menu-xs [&>li>details>summary]:after:hidden">
      {elements.value ? (
        elements.value.map((e: Element, i: number) => (
          <div key={i}>
            {e.type === 'list' && !e.folder && <List e={e} />}
            {e.type === 'note' && !e.folder && <Notes e={e} />}
            {e.type === 'folder' && !e.folder && (
              <Folder id={e.id} name={e.name} />
            )}
          </div>
        ))
      )
      : (
        <div>
          <ul className="menu w-full">
            <li>
              <button
                className="whitespace-nowrap"
                onClick={() => {
                  openCreateList.value = true
                  parent.value = {
                    type: 'space',
                    id: space.value.id,
                  }
                }}
              >
                <AddFolderIcon />
                Add Folder
              </button>
            </li>
            <li>
              <button className="whitespace-nowrap">
                <AddFileIcon />
                Add File
              </button>
            </li>
            <li>
              <button
                className="whitespace-nowrap"
                onClick={() => {
                  openCreateList.value = true
                  parent.value = {
                    type: 'space',
                    id: space.value.id,
                  }
                }}
              >
                <AddListIcon />
                Add List
              </button>
            </li>
          </ul>
        </div>
      )
      }
    </ul>
  )
}

const Folder = ({ id, name }: { id: number; name: string }) => {
  return (
    <li>
      <details>
        <summary className="group pr-1">
          <label className={`swap`}>
            <input type="checkbox" />
            <span className="swap-on icon-[solar--folder-open-line-duotone] h-4 w-4"></span>
            <span className="swap-off icon-[solar--folder-with-files-outline] h-4 w-4"></span>
          </label>
          {name}
          <MenuTrigger>
            <Button className="btn btn-square btn-ghost btn-xs invisible group-hover:visible">
              <span className="icon-[solar--menu-dots-bold]"></span>
            </Button>
            <Popover>
              <Menu className="menu menu-xs rounded-box bg-base-300">
                <MenuItem>
                  <li>
                    <button
                      className="whitespace-nowrap"
                      onClick={() => {
                        openCreateFolder.value = true
                        // parent.value = {
                        //   type: 'folder',
                        //   id: e.id,
                        // }
                      }}
                    >
                      <AddFolderIcon className="h-5 w-5" />
                      Add Folder
                    </button>
                  </li>
                </MenuItem>
                <MenuItem>
                  <li>
                    <button className="whitespace-nowrap">
                      <AddFileIcon className="h-5 w-5" />
                      Add File
                    </button>
                  </li>
                </MenuItem>
                <MenuItem>
                  <li>
                    <button
                      className="whitespace-nowrap"
                      onClick={() => {
                        openCreateList.value = true
                        // if (e.type === 'folder') {
                        //   parent.value = {
                        //     type: 'folder',
                        //     id: e.id,
                        //   }
                        // }
                      }}
                    >
                      <AddListIcon className="h-5 w-5" />
                      Add List
                    </button>
                  </li>
                </MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
        </summary>
        <ul className="[&>li>details>summary]:after:hidden">
          {elements.value?.map(
            (e: Element, i: number) =>
              e.folder === id && (
                <Fragment key={i}>
                  {e.type === 'list' && <List e={e} />}
                  {e.type === 'note' && <Notes e={e} />}
                  {e.type === 'folder' && <Folder id={e.id} name={e.name} />}
                </Fragment>
              ),
          )}
        </ul>
      </details>
    </li>
  )
}

const List = ({ e }: { e: Element }) => {
  return (
    <li>
      <Link to={`/list/${e.id}`} className="group pr-1">
        <span className="icon-[solar--clipboard-list-outline] h-4 w-4"></span>
        {e.name}
        <div className="inline-flex items-center">
          <MenuTrigger>
            <Button className="btn btn-square btn-ghost btn-xs invisible mr-0 group-hover:visible">
              <PlusIcon className="h-4 w-4" />
            </Button>
            <Popover>
              <Menu className="menu menu-xs rounded-box bg-base-300">
                <MenuItem>
                  <li>
                    <button
                      className="whitespace-nowrap"
                      onClick={() => {
                        openCreateFolder.value = true
                        parent.value = {
                          type: 'folder',
                          id: e.id,
                        }
                      }}
                    >
                      <AddFolderIcon className="h-5 w-5" />
                      Add Folder
                    </button>
                  </li>
                </MenuItem>
                <MenuItem>
                  <li>
                    <button className="whitespace-nowrap">
                      <AddFileIcon className="h-5 w-5" />
                      Add File
                    </button>
                  </li>
                </MenuItem>
                <MenuItem>
                  <li>
                    <button
                      className="whitespace-nowrap"
                      onClick={() => {
                        openCreateList.value = true
                        if (e.type === 'folder') {
                          parent.value = {
                            type: 'folder',
                            id: e.id,
                          }
                        }
                      }}
                    >
                      <AddListIcon className="h-5 w-5" />
                      Add List
                    </button>
                  </li>
                </MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
          <MenuTrigger>
            <Button className="btn btn-square btn-ghost btn-xs invisible group-hover:visible">
              <span className="icon-[solar--menu-dots-bold]"></span>
            </Button>
            <Popover>
              <Menu className="menu menu-xs rounded-box bg-base-300">
                <MenuItem>
                  <li>
                    <button
                      className="whitespace-nowrap"
                      onClick={() => {
                        openCreateFolder.value = true
                        parent.value = {
                          type: 'folder',
                          id: e.id,
                        }
                      }}
                    >
                      <AddFolderIcon className="h-5 w-5" />
                      Add Folder
                    </button>
                  </li>
                </MenuItem>
                <MenuItem>
                  <li>
                    <button className="whitespace-nowrap">
                      <AddFileIcon className="h-5 w-5" />
                      Add File
                    </button>
                  </li>
                </MenuItem>
                <MenuItem>
                  <li>
                    <button
                      className="whitespace-nowrap"
                      onClick={() => {
                        openCreateList.value = true
                        if (e.type === 'folder') {
                          parent.value = {
                            type: 'folder',
                            id: e.id,
                          }
                        }
                      }}
                    >
                      <AddListIcon className="h-5 w-5" />
                      Add List
                    </button>
                  </li>
                </MenuItem>
              </Menu>
            </Popover>
          </MenuTrigger>
        </div>
      </Link>
    </li>
  )
}

const Notes = ({ e }: { e: Element }) => {
  return (
    <li>
      <Link to={`/notes/${e.id}`} className="group pr-1">
        <span className="icon-[solar--file-text-outline]"></span>
        {e.name}
        <MenuTrigger>
          <Button className="btn btn-square btn-ghost btn-xs invisible group-hover:visible">
            <span className="icon-[solar--menu-dots-bold]"></span>
          </Button>
          <Popover>
            <Menu className="menu menu-xs rounded-box bg-base-300">
              <MenuItem>
                <li>
                  <button
                    className="whitespace-nowrap"
                    onClick={() => {
                      openCreateFolder.value = true
                      parent.value = {
                        type: 'folder',
                        id: e.id,
                      }
                    }}
                  >
                    <AddFolderIcon className="h-5 w-5" />
                    Add Folder
                  </button>
                </li>
              </MenuItem>
              <MenuItem>
                <li>
                  <button className="whitespace-nowrap">
                    <AddFileIcon className="h-5 w-5" />
                    Add File
                  </button>
                </li>
              </MenuItem>
              <MenuItem>
                <li>
                  <button
                    className="whitespace-nowrap"
                    onClick={() => {
                      openCreateList.value = true
                      if (e.type === 'folder') {
                        parent.value = {
                          type: 'folder',
                          id: e.id,
                        }
                      }
                    }}
                  >
                    <AddListIcon className="h-5 w-5" />
                    Add List
                  </button>
                </li>
              </MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      </Link>
    </li>
  )
}
