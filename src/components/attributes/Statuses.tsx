import { Signal, signal } from '@preact/signals-react'
import DragIcon from '../../assets/svgs/drag.svg?react'
import DotsIcon from '../../assets/svgs/dotsBold.svg?react'
import PlusIcon from '../../assets/svgs/plus.svg?react'
import EditIcon from '../../assets/svgs/edit.svg?react'
import TrashIcon from '../../assets/svgs/trash.svg?react'
import ColorsIcon from '../../assets/svgs/colors.svg?react'
import colors from '../../data/colors.json'
import {
  DndContext,
  // DragEndEvent,
  DragOverEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
// import { createPortal } from 'react'
import { Button, Menu } from 'react-aria-components'

interface Props {
  preset: any
  savePreset: Signal<number>
}

const overlay = signal<any>(null)
const error = signal<any>(null)

export default function Statuses({ preset, savePreset }: Props) {
  const statuses = preset.value.attributes.statuses.values
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function onDragEnd() {
    // const { active, over } = e

    // if (active.id !== over?.id) {
    //   let oldIndex = null
    //   let newIndex = null
    //   const oldContainer = active?.data?.current?.type
    //   const newContainer = over?.data?.current?.type
    // // Si se mueve dentro del mismo contenedor
    // if (newContainer === oldContainer) {
    //   oldIndex = statuses[oldContainer].findIndex(
    //     (t: any) => t.id === active.id,
    //   )
    //   newIndex = statuses[newContainer].findIndex(
    //     (t: any) => t.id === over?.id,
    //   )
    //   statuses[newContainer] = arrayMove(
    //     statuses[newContainer],
    //     oldIndex,
    //     newIndex,
    //   )
    // } else {
    //   oldIndex = statuses[oldContainer].findIndex(
    //     (t: any) => t.id === active.id,
    //   )
    // Si se mueve dentro de un contenedor con otros elementos
    // if (typeof over?.id === 'number') {
    // newIndex = statuses[newContainer].findIndex(
    //   (t: any) => t.id === over?.id,
    // )
    // const status = statuses[oldContainer].splice(oldIndex, 1)
    // console.log('status :>> ', status[0])
    // statuses[newContainer].splice(newIndex, 0, status[0])
    // console.log('statusesMoved :>> ', statuses)
    // Si se mueve a un contenedor vacio
    // } else {
    //   const status = statuses[oldContainer].splice(oldIndex, 1)
    //   statuses[newContainer].unshift(status[0])
    // }
    // }
    preset.value = {
      ...preset.value,
      attributes: {
        ...preset.value.attributes,
        statuses: {
          active: preset.value.attributes.statuses.active,
          values: statuses,
        },
      },
    }
    // }
    overlay.value = null
  }
  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e

    if (!over) return

    if (active.id !== over?.id) {
      let oldIndex = null
      let newIndex = null
      const oldContainer = active?.data?.current?.type
      const newContainer = over?.data?.current?.type
      // Si se mueve dentro del mismo contenedor
      if (newContainer === oldContainer) {
        oldIndex = statuses[oldContainer].findIndex(
          (t: any) => t.id === active.id,
        )
        newIndex = statuses[newContainer].findIndex(
          (t: any) => t.id === over?.id,
        )
        statuses[newContainer] = arrayMove(
          statuses[newContainer],
          oldIndex,
          newIndex,
        )
      } else {
        oldIndex = statuses[oldContainer].findIndex(
          (t: any) => t.id === active.id,
        )
        // Si se mueve dentro de un contenedor con otros elementos
        // if (typeof over?.id === 'number') {
        newIndex = statuses[newContainer].findIndex(
          (t: any) => t.id === over?.id,
        )
        const status = statuses[oldContainer].splice(oldIndex, 1)
        statuses[newContainer].splice(newIndex, 0, status[0])
        overlay.value = status
        // Si se mueve a un contenedor vacio
        // } else {
        //   const status = statuses[oldContainer].splice(oldIndex, 1)
        //   statuses[newContainer].unshift(status[0])
      }
    } else {
      return
    }
  }

  const onChangeColor = (
    color: string,
    status: any,
    index: number,
    type: string,
  ) => {
    if (color) {
      if (statuses[type].some((p: any) => p.color === color)) {
        error.value = {
          parent: status.id,
          message: 'Color already used.',
        }
      } else {
        const newColorPriority = {
          ...status,
          color,
        }
        const newStatuses = statuses
        newStatuses.splice(index, 1, newColorPriority)
        preset.value = {
          ...preset.value,
          attributes: {
            ...preset.value.attributes,
            statuses: {
              active: preset.value.attributes.statuses.active,
              values: newStatuses,
            },
          },
        }
        error.value = ''
        savePreset.value = preset.value.id
      }
    } else {
      error.value = {
        parent: status.id,
        message: 'Please, select a valid color',
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <SortableContext
        items={Object.keys(statuses).map((s: string) => s)}
        strategy={verticalListSortingStrategy}
      >
        {Object.keys(statuses).map((s: string) => (
          <Container
            key={s}
            statuses={statuses[s]}
            type={s}
            onChangeColor={onChangeColor}
          />
        ))}
      </SortableContext>
      <DragOverlay>
        {overlay.value ? <Overlay status={overlay.value} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

const Container = ({ statuses, type, onChangeColor }: any) => {
  // const { setNodeRef, attributes, listeners } = useSortable({
  //   id: type,
  //   data: {
  //     type,
  //   },
  // })

  // const style = {
  //   transition,
  //   transform: CSS.Transform.toString(transform),
  // }

  return (
    <div
      // {...(attributes as any)}
      // {...listeners}
      // ref={setNodeRef}
      // style={style}
      className="mb-8"
    >
      <h3 className="text-xl capitalize">{type}</h3>

      <SortableContext
        items={statuses?.map((s: any) => s.id) || []}
        strategy={verticalListSortingStrategy}
      >
        {statuses?.length ? (
          statuses.map((status: any, i: number) => (
            <Status
              status={status}
              type={type}
              index={i}
              isDragging={overlay.value ? overlay.value.id : null}
              onChangeColor={onChangeColor}
            />
          ))
        ) : (
          <div className="m-2 border border-dotted p-2 text-center">
            Drag here to add a {type} status
          </div>
        )}
      </SortableContext>
      <div className="text-right">
        <button className="btn btn-ghost btn-sm">
          <PlusIcon className="h-5 w-5" />
          Add Status
        </button>
      </div>
    </div>
  )
}

const Status = ({ status, isDragging, type, index, onChangeColor }: any) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: status.id,
      data: {
        type,
      },
    })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const role: string = 'button'
  const attributesFixed = {
    ...attributes,
    role: role as any,
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`my-2 flex items-center justify-between rounded-btn bg-base-100 px-2 ${
        isDragging === status.id ? 'opacity-50' : ''
      }`}
    >
      <button {...listeners} {...attributesFixed} className="cursor-move">
        <DragIcon />
      </button>
      <div className="inline-flex">
        <Menu>
          <Button
            className={`mx-2 h-5 w-5 rounded-full bg-${status.color}-500`}
          ></Button>
          {/* <Menu.Items className="absolute z-50 max-w-xs translate-y-7 gap-3 rounded-box bg-neutral p-4">
            <h3 className="mb-2 font-bold">COLOR</h3>
            {colors.map((color) => (
              <Menu.Item>
                <input
                  type="button"
                  className={`bg-${color}-500 mr-2 h-6 w-6 cursor-pointer rounded-full ring-primary hover:ring-4`}
                  onClick={() => onChangeColor(color, status, index, type)}
                />
              </Menu.Item>
            ))}
          </Menu.Items> */}
        </Menu>
      </div>
      <input
        type="text"
        className="w-full bg-transparent p-1 outline-none"
        value={status.name}
      />
      <Menu>
        <Button>
          <DotsIcon />
        </Button>
        {/* <Menu.Items className="menu menu-sm absolute z-50 translate-x-72 translate-y-16 rounded-box bg-neutral">
          <Menu.Item>
            <li>
              <button
              // onClick={() => {
              //   nameRef.current.disabled = false
              //   nameRef.current.focus()
              //   nameRef.current.select()
              //   rename.value = priority.id
              // }}
              >
                <EditIcon className="h-4 w-4" /> Rename
              </button>
            </li>
          </Menu.Item>
          <Menu.Item>
            <li>
              <button>
                <ColorsIcon className="h-4 w-4" /> Change color
              </button>
            </li>
          </Menu.Item>
          <Menu.Item>
            <li>
              <button className="text-error">
                <TrashIcon className="h-4 w-4" /> Delete
              </button>
            </li>
          </Menu.Item>
        </Menu.Items> */}
      </Menu>
    </div>
  )
}

const Overlay = ({ status }: any) => {
  return (
    <div className="my-2 flex items-center justify-between rounded-btn bg-base-100 px-2">
      <div>
        <DragIcon />
      </div>
      <div className="inline-flex">
        <span className={`mx-2 h-5 w-5 rounded-full bg-${status?.color}-500`} />
      </div>
      <span className="w-full bg-transparent p-1 outline-none">
        {status?.name}
      </span>
      <div>
        <DotsIcon />
      </div>
    </div>
  )
}
