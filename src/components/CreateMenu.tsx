import { useTabsStore } from "@/utils/zustand";
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from "react-aria-components";
import { useNavigate } from "react-router-dom";

interface Props {
  accountId: number | undefined;
  spaces: any;
  setSpaces: (value: any) => void;
}

export default function CreateMenu({ accountId, spaces, setSpaces }: Props) {
  const { tabs, setTabs, setSelectedTab } = useTabsStore();
  const navigate = useNavigate();

  const onNewNote = () => {
    setTabs([
      ...tabs,
      {
        path: "/note/",
        title: "Untitled",
      },
    ]);
    setSelectedTab({
      path: "/note/",
      title: "Untitled",
    });
    navigate("/note/");
  };
  return (
    <>
      <MenuTrigger>
        <Button aria-label="Menu" className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[tabler--plus] size-4"></span>
        </Button>
        <Popover placement="bottom left">
          <Menu className="dialog menu">
            <MenuItem onAction={() => onNewNote()}>
              <li>
                <Button className="whitespace-nowrap">
                  <span className="icon-[solar--file-smile-line-duotone] size-5"></span>
                  Note
                </Button>
              </li>
            </MenuItem>
            <MenuItem onAction={() => alert("open")}>
              <li>
                <Button className="whitespace-nowrap">
                  <span className="icon-[solar--clipboard-add-line-duotone] size-5"></span>
                  List
                </Button>
              </li>
            </MenuItem>
            <MenuItem onAction={() => alert("open")}>
              <li>
                <Button className="whitespace-nowrap">
                  <span className="icon-[solar--add-folder-line-duotone] size-5"></span>
                  Folder
                </Button>
              </li>
            </MenuItem>
            <MenuItem onAction={() => alert("open")}>
              <li>
                <Button className="whitespace-nowrap">
                  <span className="icon-[solar--planet-line-duotone] size-5"></span>
                  Space
                </Button>
              </li>
            </MenuItem>
          </Menu>
        </Popover>
      </MenuTrigger>
      {/*<DialogTrigger>
        <Button className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[solar--add-circle-line-duotone] size-6"></span>
        </Button>
        <Modal
          isDismissable
          className="dialog card card-compact mx-3 w-full md:mx-36 lg:w-3/5 xl:w-2/5"
        >
          <Dialog className="card-body">
            {({ close }) => (
              <Tabs>
                <TabList
                  aria-label="Select what you want to create"
                  className="tabs tabs-bordered"
                >
                  {["item", "list", "note", "space"].map((t, i: number) => (
                    <Tab key={i} id={t} className="tab capitalize selected:tab-active">
                      {t}
                    </Tab>
                  ))}
                </TabList>
                <TabPanel id="item" className="pt-3">
                  <CreateItem
                  // accountId={accountId} close={close}
                  />
                </TabPanel>
                <TabPanel id="space" className="pt-3">
                  <CreateSpace
                    accountId={accountId}
                    spaces={spaces}
                    setSpaces={setSpaces}
                    onClose={() => {
                      close();
                    }}
                  />
                </TabPanel>
              </Tabs>
            )}
          </Dialog>
        </Modal>
      </DialogTrigger>*/}
    </>
  );
}
