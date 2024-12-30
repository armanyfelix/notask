import { Signal, signal } from '@preact/signals-react'
import PlusIcon from '../../assets/svgs/plus.svg?react'
// import { createPortal } from 'react'
import { useDrag } from 'react-aria'
import {
  Button,
  DropZone,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  Text,
  TextDropItem,
} from 'react-aria-components'
import colors from '../../data/colors.json'
import DragIcon from '../../assets/svgs/drag.svg?react'
import DotsIcon from '../../assets/svgs/dotsBold.svg?react'

interface Props {
  config: any
  // savePreset: Signal<number>
}

const dropped = signal<any>(null)
// const statuses = signal<any>(null)

export default function Statuses({ config }: Props) {
  const onDrop = async (e: any, category: string) => {
    let items = await Promise.all(
      e.items
        .filter((item: any) => item.kind === 'text' && item.types.has('status'))
        .map((item: TextDropItem) => item.getText('status')),
    )
    const item = JSON.parse(items[0])
    const newConfig = config
    newConfig.statuses[category].push({
      ...item,
      type: category,
    })
    const removedStatus = newConfig.statuses[item.type].filter(
      (i: any) => i.name !== item.name,
    )

    newConfig.statuses[item.type] = removedStatus
    // console.log('newConfig :>> ', newConfig)

    config.value = newConfig

    dropped.value = category
    // console.log('preset.value :>> ', preset.value)
  }
  return (
    <div className="p-8">
      {config.value &&
        config.value.statuses &&
        Object.keys(config.value.statuses).map((category: string) => (
          <div className="mb-1">
            <h3 className="text-xl capitalize">{category}</h3>
            <DropZone
              className={`[data-drop-target]:border-primary [data-focus-visible]:bg-primary/20} m-2 w-full border-2 border-dotted border-base-content p-2 text-center`}
              onDrop={(e) => onDrop(e, category)}
            >
              {config.value.statuses[category]?.length ? (
                config.value.statuses[category].map((status: any, i: number) => (
                  <Status
                    status={status}
                    index={i}
                    // onChangeColor={onChangeColor}
                  />
                ))
              ) : (
                <div
                  className={`[data-drop-target]:border-primary [data-focus-visible]:bg-primary/20} m-2 w-full border-2 border-dotted border-base-content p-2 text-center`}
                >
                  <Text>Drag here to add a {category} status</Text>
                </div>
              )}
            </DropZone>
            <div className="text-right">
              <Button className="btn btn-ghost btn-sm">
                <PlusIcon className="h-5 w-5" />
                Add Status
              </Button>
            </div>
          </div>
        ))}
    </div>
  )
}

const Status = ({ status }: any) => {
  let { dragProps } = useDrag({
    getItems() {
      return [
        {
          status: JSON.stringify(status),
        },
      ]
    },
  })

  return (
    <div
      {...dragProps}
      role="button"
      tabIndex={0}
      className={`m-2 flex items-center justify-between rounded-btn bg-base-100 pl-1 pr-2`}
    >
      <Button className="cursor-move">
        <DragIcon />
      </Button>
      <div className="inline-flex">
        <MenuTrigger>
          <Button
            className={`mx-2 h-5 w-5 rounded-full bg-${status.color}-500`}
          ></Button>
          <Popover>
            <Menu className="menu menu-xs rounded-box bg-base-300">
              <h3 className="mb-2 font-bold">COLOR</h3>
              {colors.map((color) => (
                <MenuItem>
                  <input
                    type="button"
                    className={`bg-${color}-500 mr-2 h-6 w-6 cursor-pointer rounded-full ring-primary hover:ring-4`}
                    // onClick={() => onChangeColor(color, status, index, type)}
                  />
                </MenuItem>
              ))}
            </Menu>
          </Popover>
        </MenuTrigger>
      </div>
      <input
        type="text"
        className="w-full bg-transparent p-1 outline-none"
        value={status.name}
      />
      <MenuTrigger>
        <Button>
          <DotsIcon />
        </Button>
        <Popover className="menu menu-sm absolute z-50 translate-x-72 translate-y-16 rounded-box bg-neutral">
          <MenuItem>
            <li>
              <Button
              // onClick={() => {
              //   nameRef.current.disabled = false
              //   nameRef.current.focus()
              //   nameRef.current.select()
              //   rename.value = priority.id
              // }}
              >
                {/* <EditIcon className="h-4 w-4" /> Rename */}
                Rename
              </Button>
            </li>
          </MenuItem>
          <MenuItem>
            <li>
              <Button>
                {/* <ColorsIcon className="h-4 w-4" /> Change color */}
                Change color
              </Button>
            </li>
          </MenuItem>
          <MenuItem>
            <li>
              <Button className="text-error">
                {/* <TrashIcon className="h-4 w-4" /> Delete */}
                Delete
              </Button>
            </li>
          </MenuItem>
        </Popover>
      </MenuTrigger>
    </div>
  )
}
