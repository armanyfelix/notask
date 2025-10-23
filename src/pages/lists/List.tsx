import { useEffect, useState } from "react";
import DotsIcon from "../../assets/svgs/dots.svg?react";
import ShareIcon from "../../assets/svgs/share.svg?react";
import StarIcon from "../../assets/svgs/star.svg?react";
import StarSolidIcon from "../../assets/svgs/starSolid.svg?react";
import { Suspense } from "react";
import ItemView from "../../views/ItemView";
import { useParams } from "react-router-dom";
import supabase from "../../utils/supabase";
import TableView from "../../views/TableView";
import { useAccountStore } from "../../utils/zustand";
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
} from "react-aria-components";
import CreateItemModal from "@/components/CreateItemModal";
import { Icon } from "@iconify-icon/react/dist/iconify.mjs";

const groupBy = ["None", "Status", "Priority", "Member", "Tag", "Date"];
export default function List() {
  const [list, setList] = useState<any>(null);
  const [items, setItems] = useState<any>([]);
  const [pinItemView, setPinItemView] = useState<boolean>(false);
  const [item, setItem] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [parents, setParents] = useState<any>([]);
  const [space, setSpace] = useState<any>(null);
  const [listSettingsOpen, setListSettingsOpen] = useState<boolean>(false);

  const { id } = useParams();
  const { account, setAccount } = useAccountStore((s) => s);
  // const submitInputRef = useRef<any>()

  const handlePinView = () => {
    setPinItemView(!pinItemView);
  };
  const handleGroupBy = (g: string) => {
    const newPreferences = {
      ...preferences,
      group_by: g,
    };
    localStorage.setItem(String(id), JSON.stringify(newPreferences));
    setPreferences(newPreferences);
  };
  const changeView = (v: string) => {
    const newPreferences = {
      ...preferences,
      view: v,
    };
    localStorage.setItem(String(id), JSON.stringify(newPreferences));
    setPreferences(newPreferences);
  };
  const showClosed = () => {
    const newPreferences = {
      ...preferences,
      show_closed: !preferences?.show_closed,
    };
    localStorage.setItem(String(id), JSON.stringify(newPreferences));
    setPreferences(newPreferences);
  };
  const showDetails = () => {
    const newPreferences = {
      ...preferences,
      show_details: !preferences?.show_details || false,
    };
    localStorage.setItem(String(id), JSON.stringify(newPreferences));
    setPreferences(newPreferences);
  };
  const addToFavorite = async () => {
    // try {
    //   const { data, error } = await supabase
    //     .from('lists')
    //     .update([{ favorite: !list?.favorite }])
    //     .eq('id', id)
    //     .select()
    //     .single()
    //   if (!error) {
    //     setList(data)
    //   } else {
    //     console.log(error)
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
  };

  const getParents = async (id: number) => {
    const { data } = await supabase
      .from("folders")
      .select("name, folder")
      .eq("id", id)
      .single();
    if (data) {
      setParents([...parents, data.name]);
      if (data.folder) {
        getParents(data.folder);
      }
    }
  };

  const getSpace = async (id: number) => {
    const { data } = await supabase
      .from("spaces")
      .select("id, name")
      .eq("id", id)
      .single();
    if (data) {
      setSpace(data);
    }
  };
  const getList = async () => {
    if (id) {
      try {
        const { data, error } = await supabase
          .from("lists")
          .select("*")
          .eq("id", Number(id))
          .single();
        if (data) {
          setList(data);
          setSettings(data.settings);
          if (data.folder) {
            getParents(data.folder);
          }
          if (data.space) {
            getSpace(data.space);
          }
        } else {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getItems = async () => {
    if (id) {
      try {
        const { data, error }: any = await supabase
          .from("items")
          .select("*")
          .eq("list", Number(id));
        if (data) {
          setItems(data);
        } else {
          console.log(error);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onDeleteItem = async () => {
    try {
      getItems();
    } catch (error) {
      console.log(error);
    }
  };

  const selectItem = (i: any) => {
    setItem(items[i]);
    // openItemModal.value = true
  };

  useEffect(() => {
    if (id) {
      setParents([]);
      getItems();
      getList();
      const view_settings = localStorage.getItem(String(id));
      if (view_settings) {
        setPreferences(JSON.parse(view_settings));
      }
    }
  }, [id]);

  return (
    <div className="inline-flex h-[94vh] w-full rounded-box bg-base-100">
      <div className="relative w-full overflow-y-auto pb-32">
        <Navbar
          addToFavorite={addToFavorite}
          account={account}
          setAccount={setAccount}
          list={list}
          space={space}
          parents={parents}
          listSettingsOpen={listSettingsOpen}
          setListSettingsOpen={setListSettingsOpen}
        />
        <div className="mx-auto border-2 border-base-200/40 p-3 shadow-md">
          <Options getItems={getItems} list={list} space={space} />
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
      {item && !pinItemView ? (
        <section className="border-l border-base-200/50">
          <ItemView
            // settings={settings}
            item={item}
            setItem={setItem}
            pinItemView={pinItemView}
            handlePinView={handlePinView}
            onDeleteItem={onDeleteItem}
          />
        </section>
      ) : (
        ""
      )}
    </div>
  );
}

const Navbar = ({
  addToFavorite,
  list,
  space,
  parents,
  listSettingsOpen,
  setListSettingsOpen,
}: any) => {
  return (
    <header className="flex flex-wrap items-center justify-between px-4 py-1">
      <div className="breadcrumbs text-sm">
        <ul>
          {space && <li className="capitalize">{space.name}</li>}
          {parents?.map((f: string, i: number) => (
            <li key={i}>{f}</li>
          ))}
          {!list ? (
            <li>
              <div className="skeleton h-4 w-20"></div>
            </li>
          ) : (
            <li>{list?.name}</li>
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
              {list?.favorite ? (
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
                        onClick={() => setListSettingsOpen(!listSettingsOpen)}
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
    </header>
  );
};

const Options = ({ getItems, list, space }: any) => {
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
            {preferences?.show_closed ? 'Show' : 'Hide'} closed
          </button>
        </li> */}
      </ul>
      <div className="inline-flex items-center space-x-2">
        <CreateItemModal list={list} space={space} getItems={getItems} />
      </div>
    </div>
  );
};

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
                    return isPlaceholder ? <b>Status</b> : defaultChildren;
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
                      return isPlaceholder ? <b>Priority</b> : defaultChildren;
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
                    );
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
            {["Priority", "ID", "Status", "Labels"].map((colum) => (
              <Button className="btn btn-sm">{colum}</Button>
            ))}
          </div>
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
};
