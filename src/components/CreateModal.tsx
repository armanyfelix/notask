import {
  Button,
  Dialog,
  DialogTrigger,
  Modal,
  Tab,
  TabList,
  TabPanel,
  Tabs,
} from 'react-aria-components'
import CreateSpace from './common/CreateSpace'
import CreateItem from './common/CreateItem'

export default function CreateModal({ accountId, spaces }: any) {
  return (
    <DialogTrigger>
      <Button className="btn btn-square btn-ghost btn-sm">
        <span className="icon-[solar--traffic-economy-line-duotone] h-5 w-5"></span>
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
                {['item', 'list', 'note', 'space'].map((t, i: number) => (
                  <Tab
                    key={i}
                    id={t}
                    className="tab capitalize selected:tab-active"
                  >
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
                <CreateSpace accountId={accountId} spaces={spaces} close={close} />
              </TabPanel>
            </Tabs>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  )
}
