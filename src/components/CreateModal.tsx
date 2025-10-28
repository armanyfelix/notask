import { Button, Menu, MenuItem, MenuTrigger, Popover } from "react-aria-components";
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
        <Popover className="dialog" placement="bottom right">
          <Menu className="menu">
            <MenuItem onAction={() => alert("open")}>
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
