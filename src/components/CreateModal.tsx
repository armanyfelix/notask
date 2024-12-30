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
<<<<<<< HEAD
      <Button className="btn btn-square btn-ghost btn-sm">
=======
      <Button className="btn btn-circle btn-ghost">
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
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
<<<<<<< HEAD
                <CreateSpace accountId={accountId} spaces={spaces} close={close} />
=======
                <CreateSpace accountId={accountId} spaces={spaces} onClose={() => {
                  close()
                }} />
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
              </TabPanel>
            </Tabs>
          )}
        </Dialog>
      </Modal>
    </DialogTrigger>
  )
}
