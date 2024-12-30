import DragIcon from '../../assets/svgs/drag.svg?react'
import DotsIcon from '../../assets/svgs/dotsBold.svg?react'
import EditIcon from '../../assets/svgs/edit.svg?react'
import TrashIcon from '../../assets/svgs/trash.svg?react'
import ColorsIcon from '../../assets/svgs/colors.svg?react'
import PlusIcon from '../../assets/svgs/plus.svg?react'
import CheckIcon from '../../assets/svgs/checkCircle.svg?react'
import CloseIcon from '../../assets/svgs/closeCircle.svg?react'
import colors from '../../data/colors.json'
import {
  DndContext,
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
import { Signal, signal } from '@preact/signals-react'
import { useEffect, useRef } from 'react'
import Confirm from '../common/Confirm'
import { Button, Menu } from 'react-aria-components'

interface Props {
  preset: any
  savePreset: Signal<number>
}

const add = signal<boolean>(false)
const newColor = signal<string>('')
const overlay = signal<any>(null)
const rename = signal<string>('')
const newName = signal<string>('')
const error = signal<any>(null)
const confirmDelete = signal<any>(null)
const openConfirm = signal<boolean>(false)

export default function Priorities({ preset, savePreset }: Props) {
  const priorities = preset.value.attributes.priority.values
  const newPriorityRef = useRef<any>(null)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (e: any) => {
    const { active } = e
    const priority = priorities.find((i: any) => i.id === active.id)
    overlay.value = priority
  }

  const handleDragEnd = (e: any) => {
    const { active, over } = e
    if (active.id !== over.id) {
      const oldIndex = priorities.findIndex((i: any) => i.id === active.id)
      const newIndex = priorities.findIndex((i: any) => i.id === over.id)
      const reordered = arrayMove(priorities, oldIndex, newIndex)
      preset.value = {
        ...preset.value,
        attributes: {
          ...preset.value.attributes,
          priority: {
            active: preset.value.attributes.priority.active,
            values: reordered,
          },
        },
      }
    }
    savePreset.value = preset.value.id
    overlay.value = null
  }

  const onAddPriority = (e: any) => {
    e.preventDefault()
    const name = e.target.name.value
    if (!name) {
      error.value = {
        parent: null,
        message: 'Priority name cannot be empty',
      }
      return
    }
    if (
      priorities.some((p: any) => p.name.toLowerCase() === name.toLowerCase())
    ) {
      error.value = {
        parent: null,
        message: 'Priority already exist',
      }
      return
    }
    if (priorities.some((p: any) => p.color === newColor.value)) {
      error.value = {
        parent: null,
        message: 'Color already used.',
      }
      return
    }
    if (name.length >= 20) {
      error.value = {
        parent: null,
        message: "The tag name it's too long.",
      }
      return
    }
    const newPriorities = priorities
    newPriorities.push({
      id: Date.now(),
      name,
      color: newColor.value,
    })
    preset.value = {
      ...preset.value,
      attributes: {
        ...preset.value.attributes,
        priority: {
          active: preset.value.attributes.priority.active,
          values: newPriorities,
        },
      },
    }
    error.value = ''
    savePreset.value = preset.value.id
    add.value = false
    newColor.value = colors[Math.floor(Math.random() * colors.length)]
  }

  const onRename = (priority: any, index: number) => {
    if (!newName.value) {
      error.value = {
        parent: priority.id,
        message: 'Priority name cannot be empty',
      }
      return
    }
    if (
      priorities.some(
        (p: any) => p.name.toLowerCase() === newName.value.toLowerCase(),
      )
    ) {
      error.value = {
        parent: priority.id,
        message: 'Priority already exist',
      }
      return
    }
    const renamedPriority = {
      ...priority,
      name: newName.value,
    }
    const newPrioritiesValues = priorities
    newPrioritiesValues.splice(index, 1, renamedPriority)
    preset.value = {
      ...preset.value,
      attributes: {
        ...preset.value.attributes,
        priority: {
          active: preset.value.attributes.priority.active,
          values: newPrioritiesValues,
        },
      },
    }
    error.value = ''
    newName.value = ''
    rename.value = ''
    savePreset.value = preset.value.id
  }

  const onChangeColor = (color: string, priority: any, index: number) => {
    if (color) {
      if (priorities.some((p: any) => p.color === color)) {
        error.value = {
          parent: priority.id,
          message: 'Color already used.',
        }
      } else {
        const newColorPriority = {
          ...priority,
          color,
        }
        const newPriorities = priorities
        newPriorities.splice(index, 1, newColorPriority)
        preset.value = {
          ...preset.value,
          attributes: {
            ...preset.value.attributes,
            priority: {
              active: preset.value.attributes.priority.active,
              values: newPriorities,
            },
          },
        }
        error.value = ''
        savePreset.value = preset.value.id
      }
    } else {
      error.value = {
        parent: priority.id,
        message: 'Please, select a valid color',
      }
    }
  }

  const onDelete = (_priority: any, index: number) => {
    const newPriorities = priorities
    newPriorities.splice(index, 1)
    preset.value = {
      ...preset.value,
      attributes: {
        ...preset.value.attributes,
        priority: {
          active: preset.value.attributes.priority.active,
          values: newPriorities,
        },
      },
    }
    savePreset.value = preset.value.id
    openConfirm.value = false
    confirmDelete.value = null
  }

  useEffect(() => {
    if (newPriorityRef.current) {
      newPriorityRef.current.focus()
    }
  }, [newPriorityRef])

  return (
    <div className="mb-6">
      <p className="mt-2 text-sm leading-3 antialiased">
        This allows you to assign different importance to your elements, so you
        can focus on what matters the most.
      </p>
      <h3 className="mt-5 text-xl font-bold opacity-50">Priorities</h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <SortableContext
          items={priorities}
          strategy={verticalListSortingStrategy}
        >
          {priorities.map((p: any, i: number) => (
            <>
              <Priority
                key={p.id}
                priority={p}
                isDragging={overlay.value ? overlay.value.id : null}
                index={i}
                onRename={onRename}
                onChangeColor={onChangeColor}
              />
              {error.value && error.value.parent === p.id ? (
                <p className="leading-4 text-error">{error.value.message}</p>
              ) : null}
            </>
          ))}
        </SortableContext>
        <DragOverlay>
          {overlay.value ? <Overlay priority={overlay.value} /> : null}
        </DragOverlay>
      </DndContext>
      {error.value && error.value.parent === null ? (
        <p className="text-center leading-4 text-error">
          {error.value.message}
        </p>
      ) : null}
      {add.value && (
        <form onSubmit={onAddPriority}>
          <div className="relative my-2 flex items-center justify-between rounded-btn bg-base-100 px-2">
            <button className="invisible">
              <DragIcon />
            </button>
            <div className="inline-flex">
              <Menu>
                <Button
                  className={`mx-2 h-5 w-5 rounded-full ${
                    newColor.value
                      ? `bg-${newColor.value}-500`
                      : 'ring-2 ring-neutral'
                  }`}
                ></Button>
                {/* <Menu.Items className="absolute max-w-xs -translate-x-2 -translate-y-[9.5rem] gap-3 rounded-box bg-neutral p-4">
                  <h3 className="mb-2 font-bold">COLOR</h3>
                  {colors.map((color) => (
                    <Menu.Item>
                      <input
                        type="button"
                        className={`bg-${color}-500 mr-2 h-6 w-6 cursor-pointer rounded-full ring-primary hover:ring-4`}
                        onClick={() => (newColor.value = color)}
                      />
                    </Menu.Item>
                  ))}
                </Menu.Items> */}
              </Menu>
            </div>
            <input
              name="name"
              type="text"
              ref={newPriorityRef}
              className="w-full bg-transparent p-1 font-semibold outline-none"
            />
            <div className="flex items-center p-0.5">
              <button
                className="btn btn-circle btn-ghost btn-sm text-error"
                onClick={() => {
                  add.value = false
                }}
              >
                <CloseIcon />
              </button>{' '}
              <button
                type="submit"
                className="btn btn-circle btn-ghost btn-sm text-success"
              >
                <CheckIcon />
              </button>
            </div>
          </div>
        </form>
      )}
      <div className="text-right">
        <button
          className="btn btn-ghost btn-sm pl-1.5"
          onClick={() => (add.value = true)}
        >
          <PlusIcon className="h-5 w-5" />
          Add Priority
        </button>
      </div>
      <Confirm
      // data={confirmDelete}
      // open={openConfirm}
      // handleConfirm={onDelete}
      />
    </div>
  )
}

const Priority = ({
  priority,
  isDragging,
  onRename,
  onChangeColor,
  index,
}: any) => {
  const nameRef = useRef<any>(null)
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: priority.id,
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

  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus()
    }
  }, [nameRef])

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative my-2 flex items-center justify-between rounded-btn bg-base-100 px-2 py-1 ${
        isDragging === priority.id ? 'opacity-50' : ''
      }`}
    >
      <button {...attributesFixed} {...listeners} className="cursor-move">
        <DragIcon className="opacity-70" />
      </button>
      <div className="inline-flex">
        <Menu>
          <Button
            className={`mx-2 h-5 w-5 rounded-full ${
              priority.color
                ? `bg-${priority.color}-500`
                : 'ring-2 ring-neutral'
            }`}
          ></Button>
          {/* <Menu.Items className="absolute z-50 w-[257px] -translate-x-36 -translate-y-32 rounded-box bg-neutral p-4">
            <h3 className="mb-2 font-bold">COLOR</h3>
            {colors.map((color) => (
              <Menu.Item>
                <input
                  name="color"
                  type="button"
                  className={`bg-${color}-500 mx-1 h-6 w-6 cursor-pointer rounded-full ring-primary hover:ring-4`}
                  onClick={() => onChangeColor(color, priority, index)}
                />
              </Menu.Item>
            ))}
          </Menu.Items> */}
        </Menu>
      </div>
      <input
        type="text"
        className={`w-full bg-transparent p-1 text-xl font-semibold outline-none`}
        ref={nameRef}
        disabled
        value={priority.name}
        onInput={(e: any) => (newName.value = e.currentTarget.value)}
      />
      {rename.value === priority.id ? (
        <div className="flex items-center">
          <button
            className="btn btn-circle btn-ghost btn-sm text-error"
            onClick={() => {
              nameRef.current.disabled = true
              newName.value = ''
              rename.value = ''
              error.value = null
            }}
          >
            <CloseIcon />
          </button>
          <button
            className="btn btn-circle btn-ghost btn-sm text-success"
            onClick={() => onRename(priority, index)}
          >
            <CheckIcon />
          </button>
        </div>
      ) : (
        <Menu>
          <Button className="btn btn-square btn-ghost btn-xs">
            <DotsIcon />
          </Button>
          {/* <Menu.Items className="menu menu-sm absolute right-0 top-9 z-50 rounded-box bg-neutral">
            <Menu.Item>
              <li>
                <button
                  onClick={() => {
                    nameRef.current.disabled = false
                    nameRef.current.focus()
                    nameRef.current.select()
                    rename.value = priority.id
                  }}
                >
                  <EditIcon className="h-4 w-4" /> Rename
                </button>
              </li>
            </Menu.Item>
            <Menu.Item>
              <li>
                <div>
                  <Menu>
                    <Menu.Button className="flex items-center whitespace-nowrap">
                      <ColorsIcon className="mr-2 h-4 w-4" /> Change color
                    </Menu.Button>
                    <Menu.Items className="absolute z-50 w-[257px] -translate-x-36 -translate-y-32 rounded-box bg-neutral p-4">
                      <h3 className="mb-2 font-bold">COLOR</h3>
                      {colors.map((color) => (
                        <Menu.Item>
                          <input
                            name="color"
                            type="button"
                            className={`bg-${color}-500 mx-1 h-6 w-6 cursor-pointer rounded-full ring-primary hover:ring-4`}
                            onClick={() =>
                              onChangeColor(color, priority, index)
                            }
                          />
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Menu>
                </div>
              </li>
            </Menu.Item>
            <Menu.Item>
              <li>
                <button
                  className="text-error"
                  onClick={() => {
                    confirmDelete.value = {
                      type: 'delete',
                      title: 'Delete Priority',
                      element: priority,
                      index,
                    }
                    openConfirm.value = true
                  }}
                >
                  <TrashIcon className="h-4 w-4" /> Delete
                </button>
              </li>
            </Menu.Item>
          </Menu.Items> */}
        </Menu>
      )}
    </div>
  )
}

const Overlay = ({ priority }: any) => {
  return (
    <div className="my-2 flex items-center justify-between rounded-btn bg-base-100 px-2">
      <div>
        <DragIcon />
      </div>
      <div className="inline-flex">
        <span
          className={`mx-2 h-5 w-5 rounded-full bg-${priority.color}-500`}
        />
      </div>
      <span className="w-full bg-transparent p-1 outline-none">
        {priority.name}
      </span>
      <div>
        <DotsIcon />
      </div>
    </div>
  )
}
