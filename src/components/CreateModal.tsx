import {
  Button,
  Dialog,
  DialogTrigger,
  Menu,
  MenuItem,
  MenuTrigger,
  Modal,
  Popover,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from "react-aria-components";
import CreateSpace from "./common/CreateSpace";
import CreateItem from "./common/CreateItem";

interface Props {
  accountId: number | undefined;
  spaces: any;
  setSpaces: (value: any) => void;
}

export default function CreateModal({ accountId, spaces, setSpaces }: Props) {
  return (
    <>
      <MenuTrigger>
        <Button aria-label="Menu" className="btn btn-square btn-ghost btn-sm">
          <span className="icon-[solar--add-circle-line-duotone] size-6"></span>
        </Button>
        <Popover className="dialog">
          <Menu className="menu menu-sm">
            <MenuItem onAction={() => alert("open")}>
              <li>
                <Button className="whitespace-nowrap">Note</Button>
              </li>
            </MenuItem>
            <MenuItem onAction={() => alert("open")}>
              <li>
                <Button className="whitespace-nowrap">List</Button>
              </li>
            </MenuItem>
            <MenuItem onAction={() => alert("open")}>
              <li>
                <Button className="whitespace-nowrap">Folder</Button>
              </li>
            </MenuItem>
            <MenuItem onAction={() => alert("open")}>
              <li>
                <Button className="whitespace-nowrap">Space</Button>
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
