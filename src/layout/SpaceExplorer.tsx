import TrashIcon from "../assets/svgs/trash.svg?react";
import PlusIcon from "../assets/svgs/plus.svg?react";
import DotsIcon from "../assets/svgs/dotsBold.svg?react";
import AddFolderIcon from "../assets/svgs/addFolder.svg?react";
import AddFileIcon from "../assets/svgs/addFile.svg?react";
import AddListIcon from "../assets/svgs/addList.svg?react";
import supabase from "../utils/supabase";
import { Fragment, useEffect, useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from "react-aria-components";
import CreateFolderModal from "../components/CreateFolderModal";
import CreateListModal from "../components/CreateListModal";
import { Link } from "react-router-dom";

interface Props {
  space: any;
  account: any;
  setAccount: any;
}

type Element = {
  id: number;
  name: string;
  folder: number;
  space: number;
  type: "list" | "note" | "folder";
};

export default function SpaceExplorer({ space, account, setAccount }: Props) {
  const [openCreateFolder, setOpenCreateFolder] = useState<boolean>(false);
  const [openCreateList, setOpenCreateList] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [parent, setParent] = useState<any>(null);
  const [elements, setElements] = useState<any>(null);
  async function getData() {
    setLoading(true);
    const { data, error }: { data: any; error: any } = await supabase
      .from("space_data")
      .select("*")
      .eq("space", space.id);

    if (data) {
      setElements(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    getData();
  }, [space]);

  return (
    <>
      <Header
        space={space}
        setOpenCreateFolder={setOpenCreateFolder}
        setParent={setParent}
        setOpenCreateList={setOpenCreateList}
      />
      <ElementsTree
        space={space}
        elements={elements}
        setOpenCreateList={setOpenCreateList}
        setParent={setParent}
        setOpenCreateFolder={setOpenCreateFolder}
      />
      <CreateFolderModal
        open={openCreateFolder}
        setOpen={setOpenCreateFolder}
        parent={parent}
        account={account}
        getData={getData}
      />
      <CreateListModal
        open={openCreateList}
        setOpen={setOpenCreateList}
        parent={parent}
        account={account}
        setAccount={setAccount}
        getData={getData}
      />
    </>
  );
}

const Header = ({
  space,
  setOpenCreateFolder,
  setParent,
  setOpenCreateList,
}: any) => {
  return (
    <header className="group flex px-1 items-start justify-between">
      <h2 className="text-xl font-bold capitalize">{space.name}</h2>
      <div className="inline-flex">
        <MenuTrigger>
          <Button
            aria-label="create an element on this space"
            className={`btn btn-square btn-ghost btn-sm`}
          >
            <PlusIcon className="size-4" />
          </Button>
          <Popover>
            <Menu className="dialog menu menu-sm">
              <MenuItem
                onAction={() => {
                  setOpenCreateFolder(true);
                  setParent({
                    type: "space",
                    id: space.id,
                  });
                }}
              >
                <li>
                  <Button className="whitespace-nowrap">
                    <AddFolderIcon className="size-4" />
                    Add Folder
                  </Button>
                </li>
              </MenuItem>
              <MenuItem
                onAction={() => {
                  setOpenCreateList(true);
                  setParent({
                    type: "space",
                    id: space.id,
                  });
                }}
              >
                <li>
                  <Button className="whitespace-nowrap">
                    <AddListIcon className="size-4" />
                    Add List
                  </Button>
                </li>
              </MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
        <MenuTrigger>
          <Button className={`btn btn-square btn-ghost btn-sm`}>
            <DotsIcon className="size-4" />
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
                    <TrashIcon className="size-5" />
                    Delete
                  </button>
                </li>
              </MenuItem>
            </Menu>
          </Popover>
        </MenuTrigger>
      </div>
    </header>
  );
};

const ElementsTree = ({
  space,
  elements,
  setOpenCreateList,
  setParent,
  setOpenCreateFolder,
}: any) => {
  return (
    <div>
      <ul className="mx-0 p-0 menu menu-xs w-full [&>li>details>summary]:after:hidden">
        {elements ? (
          elements.map((e: Element, i: number) => (
            <li key={i}>
              {e.type === "list" && !e.folder && (
                <ListItem
                  e={e}
                  setOpenCreateFolder={setOpenCreateFolder}
                  setParent={setParent}
                  setOpenCreateList={setOpenCreateList}
                />
              )}
              {e.type === "note" && !e.folder && (
                <Notes
                  e={e}
                  setOpenCreateFolder={setOpenCreateFolder}
                  setParent={setParent}
                  setOpenCreateList={setOpenCreateList}
                />
              )}
              {e.type === "folder" && !e.folder && (
                <Folder
                  id={e.id}
                  name={e.name}
                  setOpenCreateFolder={setOpenCreateFolder}
                  setOpenCreateList={setOpenCreateList}
                  elements={elements}
                />
              )}
            </li>
          ))
        ) : (
          <div>
            <ul className="menu w-full">
              <li>
                <button
                  className="whitespace-nowrap"
                  onClick={() => {
                    setOpenCreateList(true);
                    setParent({
                      type: "space",
                      id: space.id,
                    });
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
                    setOpenCreateList(true);
                    setParent({
                      type: "space",
                      id: space.id,
                    });
                  }}
                >
                  <AddListIcon />
                  Add List
                </button>
              </li>
            </ul>
          </div>
        )}
      </ul>
    </div>
  );
};

const Folder = ({
  id,
  name,
  setOpenCreateFolder,
  setOpenCreateList,
  elements,
  setParent,
}: any) => {
  return (
    <li>
      <details>
        <summary className="group pr-1">
          <label className={`swap`}>
            <input type="checkbox" />
            <span className="swap-on icon-[solar--folder-open-line-duotone] size-4"></span>
            <span className="swap-off icon-[solar--folder-with-files-outline] size-4"></span>
          </label>
          {name}
          <MenuTrigger>
            <Button className="btn btn-square btn-ghost btn-xs invisible group-hover:visible">
              <span className="icon-[solar--menu-dots-bold]"></span>
            </Button>
            <Popover>
              <Menu className="menu menu-xs dialog">
                <MenuItem>
                  <li>
                    <button
                      className="whitespace-nowrap"
                      onClick={() => {
                        setOpenCreateFolder(true);
                      }}
                    >
                      <AddFolderIcon className="size-5" />
                      Add Folder
                    </button>
                  </li>
                </MenuItem>
                <MenuItem>
                  <li>
                    <button className="whitespace-nowrap">
                      <AddFileIcon className="size-5" />
                      Add File
                    </button>
                  </li>
                </MenuItem>
                <MenuItem>
                  <li>
                    <button
                      className="whitespace-nowrap"
                      onClick={() => {
                        setOpenCreateList(true);
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
          {elements?.map(
            (e: Element, i: number) =>
              e.folder === id && (
                <Fragment key={i}>
                  {e.type === "list" && (
                    <ListItem
                      e={e}
                      setOpenCreateFolder={setOpenCreateFolder}
                      setParent={setParent}
                      setOpenCreateList={setOpenCreateList}
                    />
                  )}
                  {e.type === "note" && (
                    <Notes
                      e={e}
                      setOpenCreateFolder={setOpenCreateFolder}
                      setParent={setParent}
                      setOpenCreateList={setOpenCreateList}
                    />
                  )}
                  {e.type === "folder" && (
                    <Folder
                      id={e.id}
                      name={e.name}
                      setOpenCreateFolder={setOpenCreateFolder}
                      setOpenCreateList={setOpenCreateList}
                      elements={elements}
                    />
                  )}
                </Fragment>
              ),
          )}
        </ul>
      </details>
    </li>
  );
};

const ListItem = ({
  e,
  setOpenCreateFolder,
  setParent,
  setOpenCreateList,
}: any) => {
  return (
    <Link to={`/list/${e.id}`} className="group pr-1">
      <span className="icon-[solar--clipboard-list-outline] h-4 w-4"></span>
      {e.name}
      <div className="inline-flex items-center">
        <MenuTrigger>
          <Button className="btn btn-square btn-ghost btn-xs invisible mr-0 group-hover:visible">
            <PlusIcon className="h-4 w-4" />
          </Button>
          <Popover>
            <Menu className="menu menu-xs dialog">
              <MenuItem>
                <li>
                  <button
                    className="whitespace-nowrap"
                    onClick={() => {
                      setOpenCreateFolder(true);
                      setParent({
                        type: "folder",
                        id: e.id,
                      });
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
                      setOpenCreateList(true);
                      if (e.type === "folder") {
                        setParent({
                          type: "folder",
                          id: e.id,
                        });
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
            <Menu className="menu menu-xs dialog">
              <MenuItem>
                <li>
                  <button
                    className="whitespace-nowrap"
                    onClick={() => {
                      setOpenCreateFolder(true);
                      setParent({
                        type: "folder",
                        id: e.id,
                      });
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
                      setOpenCreateList(true);
                      if (e.type === "folder") {
                        setParent({
                          type: "folder",
                          id: e.id,
                        });
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
  );
};

const Notes = ({
  e,
  setOpenCreateFolder,
  setParent,
  setOpenCreateList,
}: any) => {
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
                      setOpenCreateFolder(true);
                      setParent({
                        type: "folder",
                        id: e.id,
                      });
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
                      setOpenCreateList(true);
                      if (e.type === "folder") {
                        setParent({
                          type: "folder",
                          id: e.id,
                        });
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
  );
};
