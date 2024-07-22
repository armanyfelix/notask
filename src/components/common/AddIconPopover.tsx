import {
  Button,
  DialogTrigger,
  DropZone,
  FileDropItem,
  FileTrigger,
  Popover,
  PopoverProps,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
} from 'react-aria-components'
import CloseIcon from '@/assets/svgs/close.svg?react'
import { imageUpload } from '@/helpers/images'

interface Props extends Omit<PopoverProps, 'children'> {
  // children: ReactNode;
  icon: any
}
// const imageUrl = signal<string | ArrayBuffer | null>(null)

export default function AddIconPopover({ icon, ...props }: Props) {
  const handleImageUpload = async (e: any) => {
    const res: any = await imageUpload(e)
    if (res && res.error) {
    } else if (res) {
      icon.value = res.image
      icon.value.url = res.url
    }
  }

  return (
    <DialogTrigger {...props}>
      <Button className="btn btn-square join-item border border-base-content/20">
        {typeof icon.value?.url === 'string' && icon.value?.url ? (
          <div className="indicator">
            <Button
              className="btn btn-circle btn-error indicator-item btn-xs text-error-content"
              onPress={() => {
                icon.value = null
              }}
            >
              <CloseIcon className="h-3 w-3" />
            </Button>
            <div className='w-6'>
              <img
                src={icon.value?.url}
                width={48}
                height={48}
                alt=""
                className=""
              />
            </div>
          </div>
        ) : (
          <span className="icon-[solar--planet-bold-duotone] h-7 w-7"></span>
        )}
      </Button>
      <Popover className="dialog card card-compact">
        <div className="card-body">
          <Tabs>
            <TabList
              aria-label="Select what you want to create"
              className="tabs tabs-bordered"
            >
              {['file'].map((t, i: number) => (
                <Tab
                  key={i}
                  id={t}
                  className="tab capitalize selected:tab-active"
                >
                  {t}
                </Tab>
              ))}
            </TabList>
            <TabPanel id="file">
              <div className="mt-4 flex items-center justify-between">
                <DropZone
                  onDrop={(e) => {
                    e.items.filter(
                      (file) => file.kind === 'file',
                    ) as FileDropItem[]
                    handleImageUpload(e)
                  }}
                  className="border-2 border-dotted border-opacity-50 p-10 text-center drop-target:bg-secondary/50 drop-target:text-secondary-content"
                >
                  <FileTrigger
                    acceptedFileTypes={['image/*']}
                    onSelect={(e) => handleImageUpload(e)}
                  >
                    <Button className="btn btn-sm mx-auto">
                      Select a file
                    </Button>
                  </FileTrigger>
                  <Text slot="label" className="mt-2 block text-center text-xs">
                    {icon.value?.name || 'Drop file here'}
                  </Text>
                </DropZone>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </Popover>
    </DialogTrigger>
  )
}
