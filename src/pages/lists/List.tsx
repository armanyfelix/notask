import { useEffect } from 'react'
import { signal } from '@preact/signals-react'
import DotsIcon from '../../assets/svgs/dots.svg?react'
import ShareIcon from '../../assets/svgs/share.svg?react'
import StarIcon from '../../assets/svgs/star.svg?react'
import StarSolidIcon from '../../assets/svgs/starSolid.svg?react'
import { Suspense } from 'react'
import ItemView from '../../views/ItemView'
import { useParams } from 'react-router-dom'
import supabase from '../../utils/supabase'
import TableView from '../../views/TableView'
import { useAccountStore } from '../../utils/zustand'
import {
  Button,
  Dialog,
  DialogTrigger,
  FieldError,
  Header,
  Label,
  ListBox,
  ListBoxItem,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  Section,
  Select,
  SelectValue,
  Switch,
  Text,
} from 'react-aria-components'
import CreateItemModal from '@/components/CreateItemModal'
import { Icon } from '@iconify-icon/react/dist/iconify.mjs'

const list = signal<any>(null)
const items = signal<any>([])
const pinItemView = signal<boolean>(false)
const item = signal<any>(null)
const settings = signal<any>(null)
const preferences = signal<any>(null)
const parents = signal<any>([])
const space = signal<any>(null)
const listSettingsOpen = signal<boolean>(false)
const groupBy = ['None', 'Status', 'Priority', 'Member', 'Tag', 'Date']
export default function List() {
  const { id } = useParams()
  const { account, setAccount } = useAccountStore((s) => s)
  // const submitInputRef = useRef<any>()

  const handlePinView = () => {
    pinItemView.value = !pinItemView.value
  }
  const handleGroupBy = (g: string) => {
    const newPreferences = {
      ...preferences.value,
      group_by: g,
    }
    localStorage.setItem(String(id), JSON.stringify(newPreferences))
    preferences.value = newPreferences
  }
  const changeView = (v: string) => {
    const newPreferences = {
      ...preferences.value,
      view: v,
    }
    localStorage.setItem(String(id), JSON.stringify(newPreferences))
    preferences.value = newPreferences
  }
  const showClosed = () => {
    const newPreferences = {
      ...preferences.value,
      show_closed: !preferences.value?.show_closed,
    }
    localStorage.setItem(String(id), JSON.stringify(newPreferences))
    preferences.value = newPreferences
  }
  const showDetails = () => {
    const newPreferences = {
      ...preferences.value,
      show_details: !preferences.value?.show_details || false,
    }
    localStorage.setItem(String(id), JSON.stringify(newPreferences))
    preferences.value = newPreferences
  }
  const addToFavorite = async () => {
    // try {
    //   const { data, error } = await supabase
    //     .from('lists')
    //     .update([{ favorite: !list.value?.favorite }])
    //     .eq('id', id)
    //     .select()
    //     .single()
    //   if (!error) {
    //     list.value = data
    //   } else {
    //     console.log(error)
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
  }

  const getParents = async (id: number) => {
    const { data } = await supabase
      .from('folders')
      .select('name, folder')
      .eq('id', id)
      .single()
    if (data) {
      parents.value = [...parents.value, data.name]
      if (data.folder) {
        getParents(data.folder)
      }
    }
  }

  const getSpace = async (id: number) => {
    const { data } = await supabase
      .from('spaces')
      .select('id, name')
      .eq('id', id)
      .single()
    if (data) {
      space.value = data
    }
  }
  const getList = async () => {
    if (id) {
      try {
        const { data, error } = await supabase
          .from('lists')
          .select('*')
          .eq('id', Number(id))
          .single()
        if (data) {
          list.value = data
          settings.value = data.settings
          if (data.folder) {
            getParents(data.folder)
          }
          if (data.space) {
            getSpace(data.space)
          }
        } else {
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const getItems = async () => {
    if (id) {
      try {
        const { data, error }: any = await supabase
          .from('items')
          .select('*')
          .eq('list', Number(id))
        if (data) {
          items.value = data
        } else {
          console.log(error)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  const onDeleteItem = async () => {
    try {
      getItems()
    } catch (error) {
      console.log(error)
    }
  }

  const selectItem = (i: any) => {
    item.value = items.value[i]
    // openItemModal.value = true
  }

  useEffect(() => {
    if (id) {
      parents.value = []
      getItems()
      getList()
      const view_settings = localStorage.getItem(String(id))
      if (view_settings) {
        preferences.value = JSON.parse(view_settings)
      }
    }
  }, [id])

  return (
    <div className="inline-flex h-[94vh] w-full rounded-box bg-base-100">
      <div className="relative w-full overflow-y-auto pb-32">
        <Navbar
          changeView={changeView}
          addToFavorite={addToFavorite}
          account={account}
          setAccount={setAccount}
        />
        <div className="mx-auto border-2 border-base-200/40 p-3 shadow-md">
          <Options getItems={getItems} />
          {/* <AddItemBar
            onAddItem={onAddItem}
            submitInputRef={submitInputRef}
          /> */}
          <Suspense fallback="Loading ...">
            <TableView
              // settings={settings}
              items={items}
              // handleOpenItem={handleOpenItem}
              // onDeleteItem={onDeleteItem}
              selectItem={selectItem}
            />
          </Suspense>
        </div>
      </div>
      {item.value && !pinItemView.value ? (
        <section className="border-l border-base-200/50">
          <ItemView
            // settings={settings}
            item={item}
            pinItemView={pinItemView}
            handlePinView={handlePinView}
            onDeleteItem={onDeleteItem}
          />
        </section>
      ) : (
        ''
      )}
      {/* <Modal
        isOpen={openItemModal.value}
        onOpenChange={() => (openItemModal.value = false)}
      >
        <Dialog className="bg-neutral/70 shadow-xl backdrop-blur-lg">
          <ItemView
            settings={settings}
            item={item}
            pinItemView={pinItemView}
            handlePinView={handlePinView}
            onDeleteItem={onDeleteItem}
          />
        </Dialog>
      </Modal> */}
    </div>
  )
}

const Navbar = ({ changeView, addToFavorite }: any) => {
  return (
    <header className="flex flex-wrap items-center justify-between px-4 py-1">
      <div className="breadcrumbs text-sm">
        <ul>
          {space.value && <li className="capitalize">{space.value.name}</li>}
          {parents.value?.map((f: string, i: number) => <li key={i}>{f}</li>)}
          {!list.value ? (
            <li>
              <div className="skeleton h-4 w-20"></div>
            </li>
          ) : (
            <li>{list.value?.name}</li>
          )}
        </ul>
      </div>
      <div>
        <ul className="flex items-center">
          <li className="tooltip tooltip-bottom" data-tip="Share">
            <DialogTrigger>
              <Button className="btn btn-square btn-sm mr-2">
                <ShareIcon className="h-5 w-5" />
                {/* <span className="pl-1">Share</span> */}
              </Button>
              <Popover>
                <Dialog>
                  <div>soon</div>
                </Dialog>
              </Popover>
            </DialogTrigger>
          </li>
          <li className="tooltip tooltip-bottom" data-tip="Add to favorites">
            <Button
              className="btn btn-square btn-sm mr-2"
              onPress={() => addToFavorite()}
            >
              {list.value?.favorite ? (
                <StarSolidIcon className="h-5 w-5 text-yellow-600" />
              ) : (
                <StarIcon className="h-5 w-5" />
              )}
            </Button>
          </li>
          <li className="tooltip tooltip-left" data-tip="List settings">
            <MenuTrigger>
              <Button className="btn btn-square btn-sm">
                <DotsIcon />
              </Button>
              <Popover>
                <Menu className="dialog menu menu-sm">
                  <MenuItem>
                    <li>
                      <button>
                        <span className="icon-[solar--pen-line-duotone]"></span>
                        Rename
                      </button>
                    </li>
                  </MenuItem>
                  <MenuItem>
                    <li>
                      <button className="text-nowrap">
                        <span className="icon-[solar--link-bold-duotone]"></span>
                        Copy link
                      </button>
                    </li>
                  </MenuItem>
                  <MenuItem>
                    <li>
                      <button
                        className="text-nowrap"
                        onClick={() =>
                          (listSettingsOpen.value = !listSettingsOpen.value)
                        }
                      >
                        <span className="icon-[solar--settings-line-duotone]"></span>
                        Settings
                      </button>
                    </li>
                  </MenuItem>
                  <MenuItem>
                    <li>
                      <button className="text-nowrap">
                        <span className="icon-[solar--move-to-folder-line-duotone]"></span>
                        Move
                      </button>
                    </li>
                  </MenuItem>
                  <MenuItem>
                    <li>
                      <button className="text-nowrap">
                        <span className="icon-[solar--copy-line-duotone]"></span>
                        Duplicate
                      </button>
                    </li>
                  </MenuItem>
                  <MenuItem>
                    <li>
                      <button className="text-nowrap">
                        <span className="icon-[solar--archive-up-minimlistic-line-duotone]"></span>
                        Archive
                      </button>
                    </li>
                  </MenuItem>
                  <MenuItem>
                    <li>
                      <button className="text-nowrap text-error">
                        <span className="icon-[solar--trash-bin-trash-line-duotone]"></span>
                        Delete List
                      </button>
                    </li>
                  </MenuItem>
                </Menu>
              </Popover>
            </MenuTrigger>
          </li>
        </ul>
      </div>
      {/* <Dialog
        open={listSettingsOpen.value}
        onClose={() => (listSettingsOpen.value = false)}
      >
        <div
          className="fixed inset-0 bg-base-100/90 backdrop-opacity-90"
          aria-hidden="true"
        />
        <Dialog.Panel className="card fixed inset-x-2 inset-y-36 z-50 mx-auto h-min max-h-[85vh] w-fit bg-base-300/70 font-futura backdrop-blur-xl sm:inset-x-20 md:inset-20">
          <div className="card-body">
            <div className="card-title text-3xl">List Settings</div>
            <AttributesConfig
              setting={settings}
              presets={presets}
              account={account}
              setAccount={setAccount}
            />
            <div className="card-actions justify-end">
              <button className="btn btn-outline btn-error">cancel</button>
              <button className="btn btn-primary">save changes</button>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog> */}
    </header>
  )
}

const Options = ({ getItems }: any) => {
  return (
    <div className="flex items-center justify-between">
      <ul className="flex items-center space-x-2">
        <li>
          <label className="input input-sm flex items-center gap-2 bg-base-200">
            <span className="icon-[solar--rounded-magnifer-line-duotone] h-5 w-5"></span>
            <input type="text" placeholder="Search" className="outline-none" />
          </label>
        </li>
        <li>
          <MenuTrigger>
            <Button className="btn btn-square btn-sm">
              <span className="icon-[solar--filter-line-duotone] h-5 w-5"></span>
            </Button>
            <Popover>
              <Menu className="dialog menu menu-sm">
                <Header>
                  <li className="menu-title">Group By</li>
                </Header>
                {groupBy.map((g: any, i: number) => (
                  <MenuItem key={i}>
                    <li>
                      <Button className="ui-selected:active" value={g}>
                        {g}
                      </Button>
                    </li>
                  </MenuItem>
                ))}
              </Menu>
            </Popover>
          </MenuTrigger>
        </li>
        <li>
          <DisplayPopover />
        </li>
        {/* <li>
          <button onClick={() => showClosed()}>
            {preferences.value?.show_closed ? 'Show' : 'Hide'} closed
          </button>
        </li> */}
      </ul>
      <div className="inline-flex items-center space-x-2">
        <CreateItemModal list={list} space={space} getItems={getItems} />
      </div>
    </div>
  )
}
// const AddItemBar = ({ onAddItem, submitInputRef }: any) => {
//   return (
//     <form onSubmit={onAddItem} className="form-control my-10">
//       <div className="group absolute bottom-0 right-1/2 z-50 translate-x-1/2 scale-125 rounded-box bg-base-300/60 shadow focus-within:shadow-inner">
//         <div className="input flex w-full items-center bg-transparent !outline-none">
//           <input
//             type="text"
//             name="name"
//             className="h-ful w-full bg-transparent text-2xl placeholder:font-serif placeholder:text-2xl"
//             placeholder="New task"
//             // autocomplete="off"
//             ref={submitInputRef}
//             value={newItem.value}
//             // onInput={(e: ChangeEvent<HTMLInputItem>) =>
//             //   (newItem.value = (e.target as HTMLInputItem).value)
//             // }
//           />
//           <div className="mr-4 hidden items-center group-focus-within:flex">
//             {/* <DatePicker btnStyles="btn btn-square btn-neutral btn-sm" />
//             <PriorityMenu
//               btnStyles="btn btn-square btn-neutral btn-sm ml-2"
//               position="right-0 top-5"
//             /> */}
//             <button type="submit" className="btn btn-primary btn-sm ml-2 leading-4">
//               Save
//               {/* <EnterIcon className="h-4 w-4" /> */}
//             </button>
//           </div>
//         </div>
//       </div>
//     </form>
//   )
// }

const DisplayPopover = () => {
  return (
    <DialogTrigger>
      <Button className="btn btn-square btn-sm">
        <span className="icon-[solar--tuning-3-line-duotone] h-5 w-5"></span>
      </Button>
      <Popover>
        <Dialog className="dialog p-4">
          <div className="mb-4 flex items-center">
            <Button className="btn btn-outline mr-4 w-32">
              <Icon
                icon="solar:server-minimalistic-bold"
                width={20}
                height={20}
              />
              List
            </Button>
            <Button className="btn btn-outline w-32">
              <Icon icon="solar:widget-4-bold" width={20} height={20} />
              Board
            </Button>
          </div>
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center">
              <Icon
                icon="solar:widget-4-bold"
                className="mr-2"
                width={20}
                height={20}
              />
              Grouping
            </div>
            <Select>
              <Label />
              <Button className="select select-xs bg-neutral text-neutral-content">
                <SelectValue className="pl-3">
                  {({ defaultChildren, isPlaceholder }) => {
                    return isPlaceholder ? <b>Status</b> : defaultChildren
                  }}
                </SelectValue>
              </Button>
              <Text slot="description" />
              <FieldError />
              <Popover>
                <ListBox>
                  <ListBoxItem>
                    <Text slot="label" />
                    <Text slot="description" />
                  </ListBoxItem>
                  <Section>
                    <Header />
                    <ListBoxItem />
                  </Section>
                </ListBox>
              </Popover>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icon
                icon="tabler:arrows-sort"
                className="mr-2"
                width={20}
                height={20}
              />
              Ordering
            </div>
            <div className="flex items-center space-x-2">
              <Select>
                <Label />
                <Button className="select btn-xs select-xs bg-neutral text-neutral-content">
                  <SelectValue className="pl-3">
                    {({ defaultChildren, isPlaceholder }) => {
                      return isPlaceholder ? <b>Priority</b> : defaultChildren
                    }}
                  </SelectValue>
                </Button>
                <Text slot="description" />
                <FieldError />
                <Popover>
                  <ListBox>
                    <ListBoxItem>
                      <Text slot="label" />
                      <Text slot="description" />
                    </ListBoxItem>
                    <Section>
                      <Header />
                      <ListBoxItem />
                    </Section>
                  </ListBox>
                </Popover>
              </Select>
              <Button className="btn btn-square btn-neutral btn-xs">
                <Icon icon="tabler:sort-descending" width={17} height={17} />
              </Button>
            </div>
          </div>
          <div className="mt-3">
            <Switch>
              <span>Order completed by recency</span>
              <div className="switch" />
            </Switch>
          </div>
          <span className="divider"></span>
          <div className="flex items-center justify-between">
            <span>Completed issues</span>
            <Select>
              <Label />
              <Button className="select select-xs">
                <SelectValue>
                  {({ defaultChildren, isPlaceholder }) => {
                    return isPlaceholder ? (
                      <>
                        <b>All</b>
                      </>
                    ) : (
                      defaultChildren
                    )
                  }}
                </SelectValue>
              </Button>
              <Text slot="description" />
              <FieldError />
              <Popover>
                <ListBox>
                  <ListBoxItem>
                    <Text slot="label" />
                    <Text slot="description" />
                  </ListBoxItem>
                  <Section>
                    <Header />
                    <ListBoxItem />
                  </Section>
                </ListBox>
              </Popover>
            </Select>
          </div>
          <div>
            <Switch>
              <span>Show sub-issues</span>
              <div className="switch" />
            </Switch>
          </div>
          <span className="divider"></span>
          <h3>List options</h3>
          <div>
            <Switch>
              <span>Show empty groups</span>
              <div className="switch" />
            </Switch>
          </div>
          <div>Display properties</div>
          <div>
            {['Priority', 'ID', 'Status', 'Labels'].map((colum) => (
              <Button className="btn btn-sm">{colum}</Button>
            ))}
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  )
}
