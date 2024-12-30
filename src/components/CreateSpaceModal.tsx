import { Signal, signal } from '@preact/signals-react'
import CloseIcon from '../assets/svgs/close.svg?react'
import { useContext } from 'react'
import { imageUpload } from '../helpers/images'
import supabase from '../utils/supabase'
import { AlertContext } from '../context/AlertContext'
import {
  Button,
  Color,
  Dialog,
  DropZone,
  FileDropItem,
  FileTrigger,
  Heading,
  Modal,
  Text,
} from 'react-aria-components'

interface Props {
  open: Signal<boolean>
  spaces: Signal<any>
  accountId: any
}

const step = signal<number>(1)
const openPicker = signal<boolean>(false)
const name = signal<string>('')
const description = signal<string>('')
const color = signal<Color | null>(null)
const image = signal<any>(null)
const imageUrl = signal<string | ArrayBuffer | null>(null)

export default function CreateSpaceModal({ open, spaces, accountId }: Props) {
  const notify = useContext(AlertContext)

  const onClose = () => {
    open.value = false
    step.value = 1
    name.value = ''
    description.value = ''
    color.value = null
    openPicker.value = false
    image.value = null
    imageUrl.value = null
  }

  const handleImageUpload = async (e: any) => {
    console.log('e :>> ', e)
    const res: any = await imageUpload(e)
    if (res && res.error) {
    } else if (res) {
      image.value = res.image
      imageUrl.value = res.url
    }
  }

  const onCreateSpace = async () => {
    if (!name.value) {
      return
    }
    let iconPath = null

    if (image.value) {
      const fileExt = image.value.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`
      const { data, error } = await supabase.storage
        .from('spaces_icons')
        .upload(filePath, image.value)
      if (error) {
        notify(
          'error',
          'The avatar could not be saved, please try again later.',
        )
      } else {
        iconPath = data.path
      }
    }

    const { data, error } = await supabase
      .from('spaces')
      .insert([
        {
          name: name.value.trim(),
          description: description.value,
          color: color.value,
          image_url: iconPath,
          // lists_preset: {
          //   ...preset.value,
          //   id: Date.now(),
          //   name: 'space preset',
          // },
          account: accountId,
        },
      ])
      .select()
      .single()

    if (error) {
      notify('error', 'Error creating the space, try again later')
    } else {
      notify('success', 'Space created')
      spaces.value = [
        ...spaces.value,
        {
          ...data,
          image_url: image.value ? URL.createObjectURL(image.value) : null,
        },
      ]
      onClose()
    }
  }

  // useEffect(() => {
  //   if (account && account.list_presets) {
  //     presets.value = account.list_presets
  //   }
  //   preset.value = defaultPreset
  // }, [])

  return (
    <Modal isDismissable isOpen={open.value} onOpenChange={onClose}>
      <Dialog className="card card-compact h-min max-h-[85vh] w-fit bg-neutral/70 backdrop-blur-xl">
        <div className="card-body">
          <Heading slot="title" className="card-title">
            {step.value > 1 && (
              <Button
                className={`btn btn-square btn-ghost btn-sm`}
                onPress={() => (step.value -= 1)}
              >
                <span className="icon-[solar--arrow-left-outline] h-5 w-5"></span>
              </Button>
            )}

            <h1>Create a new space</h1>
          </Heading>
          {step.value === 1 && <FirstStep handleImageUpload={handleImageUpload} />}
          {step.value === 2 && (
            <SecondStep handleImageUpload={handleImageUpload} />
          )}
          {step.value === 3 && <ThirdStep />}
          <div className="card-actions justify-center">
            {step.value >= 3 ? (
              <button
                className="btn btn-primary btn-block mt-6 px-6 text-xl"
                disabled={!name.value}
                onClick={() => onCreateSpace()}
              >
                Create Space
              </button>
            ) : (
              <button
                disabled={!name.value}
                className="btn btn-primary btn-block px-6 text-xl"
                onClick={() => (step.value += 1)}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </Dialog>
    </Modal>
  )
}

const FirstStep = ({ handleImageUpload }: any) => {
  return (
    <div id="1" className="flex-col">
      {/* <p className="text-sm font-semibold antialiased">
                Start a proyect
              </p> */}
      <div className="my-8">
        <div className="flex items-center justify-between px-8">
          {typeof imageUrl.value === 'string' && imageUrl.value ? (
            <div className="indicator">
              <Button
                className="btn btn-circle btn-error indicator-item btn-xs text-error-content"
                onPress={() => {
                  image.value = null
                  imageUrl.value = null
                }}
              >
                <CloseIcon className="h-3 w-3" />
              </Button>
              <img src={imageUrl?.value} width={64} height={64} alt="" />
            </div>
          ) : (
            <span className="icon-[solar--planet-bold-duotone] h-16 w-16"></span>
          )}
          <div className="">
            <DropZone
              onDrop={(e) => {
                let files = e.items.filter(
                  (file) => file.kind === 'file',
                ) as FileDropItem[]
                console.log('files :>> ', files)
              }}
              className="rounded-btn border-2 border-dotted border-opacity-50 p-5 drop-target:bg-secondary/50 drop-target:text-secondary-content"
            >
              <FileTrigger
                acceptedFileTypes={['image/*']}
                onSelect={(e) => handleImageUpload(e)}
              >
                <Button className="btn btn-sm">Select a file</Button>
              </FileTrigger>
              <Text slot="label" className="mt-2 block text-center text-xs">
                {image.value?.name || 'Drop file here'}
              </Text>
            </DropZone>
          </div>
        </div>
        <div className="w-[320px]">
          {/* <ColorSwatchPicker
            value={color.value}
            onChange={(e) => (color.value = e)}
            className="flex items-center gap-2"
          >
            <ColorSwatchPickerItem
              color="#A00"
              className={`h-9 w-9 cursor-pointer rounded-btn bg-[#A00] hover:brightness-125 ${
                color.value === parseColor('#A00') ? `ring-2` : 'ring-0'
              }`}
            >
              <ColorSwatch />
            </ColorSwatchPickerItem>
            <ColorSwatchPickerItem
              color="#f80"
              className={`h-9 w-9 cursor-pointer rounded-btn bg-[#f80] hover:brightness-125 ${
                color.value === parseColor('#f80') ? `ring-2` : 'ring-0'
              }`}
            >
              <ColorSwatch />
            </ColorSwatchPickerItem>
            <ColorSwatchPickerItem
              color="#080"
              className={`h-9 w-9 cursor-pointer rounded-btn bg-[#080] hover:brightness-125 ${
                color.value === parseColor('#080') ? `ring-2` : 'ring-0'
              }`}
            >
              <ColorSwatch />
            </ColorSwatchPickerItem>
            <ColorSwatchPickerItem
              color="#08f"
              className={`h-9 w-9 cursor-pointer rounded-btn bg-[#08f] ring-neutral-content hover:brightness-125 ${
                color.value === parseColor('#08f')? `ring-2` : 'ring-0'
              }`}
            >
              <ColorSwatch />
            </ColorSwatchPickerItem>
            <ColorSwatchPickerItem
              color="#088"
              className={`h-9 w-9 cursor-pointer rounded-btn bg-[#088] hover:brightness-125 ${
                color.value === parseColor('#088') ? `ring-2` : 'ring-0'
              }`}
            >
              <ColorSwatch />
            </ColorSwatchPickerItem>
            <ColorSwatchPickerItem
              color="#008"
              className={`h-9 w-9 cursor-pointer rounded-btn bg-[#008] hover:brightness-125 ${
                color.value === parseColor('#008') ? `ring-2` : 'ring-0'
              }`}
            >
              <ColorSwatch />
            </ColorSwatchPickerItem>
          </ColorSwatchPicker> */}
        </div>
      </div>
      <input
        className="input mt-8 w-full font-semibold !outline-none"
        placeholder="Name"
        value={name.value}
        onInput={(e) => (name.value = e.currentTarget.value)}
        onKeyUp={(e) => e.key === 'Enter' && name.value && (step.value = 2)}
      />
      <textarea
        className="textarea mt-3 w-full"
        rows={3}
        placeholder="Description (optional)"
        value={description.value}
        onInput={(e) => (description.value = e.currentTarget.value)}
        onKeyPress={(e) => e.key === 'Enter' && name.value && (step.value = 2)}
      ></textarea>
    </div>
  )
}

const SecondStep = ({ handleImageUpload }: any) => {
  return (
    <div>
      <h1 className="card-title">Icon</h1>
    </div>
  )
}

const ThirdStep = () => {
  return (
    <div className="w-full flex-col">
      <h1 className="card-title text-3xl">Space settings</h1>
      <p>You can change the space options letter</p>
      <ul className="mt-6 space-y-3 text-xl md:w-[40rem]">
        <li className="rounded-btn border border-neutral px-3 py-2 text-center">
          <div className="flex justify-between">
            <h3 className="fon-semibold">Name:</h3>
            <input
              className="ml-5 bg-transparent text-right text-xl font-semibold outline-none placeholder:opacity-50"
              placeholder="Space name"
              value={name.value}
              onInput={(e) => (name.value = e.currentTarget.value)}
            />
          </div>
          {!name.value && (
            <span className="text-sm text-error">
              The space name it's required
            </span>
          )}
        </li>
        <li className="flex justify-between rounded-btn border border-neutral px-3 py-2 text-right">
          <h3 className="">Description:</h3>
          <textarea
            className="ml-5 w-full bg-transparent text-right text-base tracking-tighter outline-none"
            rows={2}
            value={description.value}
            onInput={(e) => (description.value = e.currentTarget.value)}
          ></textarea>
        </li>
        {/* <li className="border border-neutral px-3 py-2 text-center">
                  <div className="flex justify-between">
                    <h3 className="fon-semibold">Items Name:</h3>
                    <input
                      className="ml-5 bg-transparent text-right text-xl font-semibold outline-none placeholder:opacity-50"
                      placeholder="Items name"
                      value={preset.value.items_name}
                      onInput={(e) => {
                        preset.value = {
                          ...preset.value,
                          items_name: e.currentTarget.value,
                        }
                      }}
                    />
                  </div>
                  {!preset.value.items_name && (
                    <span className="text-sm text-error">
                      The items name it's required
                    </span>
                  )}
                </li> */}
        <li className="flex max-w-2xl justify-between rounded-btn border border-neutral px-3 py-2 text-right">
          <h3 className="">Icon:</h3>
          <div className="z-50 mb-1 scale-75"></div>
        </li>
        {/* <li className="flex max-w-2xl justify-between border border-neutral px-3 py-2 text-right">
                  <h3 className="">Attributes:</h3>
                  <div className="z-10 ml-5 mt-1 flex space-x-3 text-sm font-semibold">
                    {preset.value.attributes.statuses.active && (
                      <span className="tooltip tooltip-top" data-tip="Statuses">
                        <StatusesIcon />
                      </span>
                    )}
                    {preset.value.attributes.dates.active && (
                      <span className="tooltip tooltip-top" data-tip="Dates">
                        <DatesIcon />
                      </span>
                    )}
                    {preset.value.attributes.priority.active && (
                      <span className="tooltip tooltip-top" data-tip="Priority">
                        <PriorityIcon />
                      </span>
                    )}
                    {preset.value.attributes.tags.active && (
                      <span className="tooltip tooltip-top" data-tip="Tags">
                        <TagsIcon />
                      </span>
                    )}
                    {preset.value.attributes.fields.active && (
                      <span className="tooltip tooltip-top" data-tip="Fields">
                        <FieldsIcon />
                      </span>
                    )}
                    {preset.value.attributes.timer.active && (
                      <span className="tooltip tooltip-top" data-tip="Timer">
                        <TimerIcon />
                      </span>
                    )}
                    {preset.value.attributes.relationships.active && (
                      <span
                        className="tooltip tooltip-top"
                        data-tip="Relationships"
                      >
                        <RelationshipsIcon />
                      </span>
                    )}
                    {preset.value.attributes.collaboration.active && (
                      <span
                        className="tooltip tooltip-top"
                        data-tip="Collaboration"
                      >
                        <CollaborationIcon />
                      </span>
                    )}
                  </div>
                </li> */}
      </ul>
    </div>
  )
}
