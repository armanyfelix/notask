import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Signal, signal } from '@preact/signals-react'
import PenIcon from '../assets/svgs/pen.svg?react'
import CommentIcon from '../assets/svgs/comment.svg?react'
import ElementMenu from '../components/ItemMenu'

interface Props {
  elements: Signal<any>
  handleOpenTask: any
  onDeleteElement: any
}

const overlay = signal(null)
export default function ListView({
  elements,
  handleOpenTask,
  onDeleteElement,
}: Props) {
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 15,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
  function handleDragStart(event: any) {
    const { active } = event
    overlay.value = active.data.current.sortable.items.find(
      (i: any) => i.$id === active.id,
    ).name
  }
  function handleDragEnd(event: any) {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = elements.value.findIndex((t: any) => t.$id === active.id)
      const newIndex = elements.value.findIndex((t: any) => t.$id === over.id)
      elements.value = arrayMove(elements.value, oldIndex, newIndex)
    }
    overlay.value = null
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div>
        <table className="table static">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <SortableContext
              items={elements.value}
              strategy={verticalListSortingStrategy}
            >
              {elements.value?.map((t: any) => (
                <SortableItem
                  key={t.$id}
                  element={t}
                  onDeleteElement={onDeleteElement}
                  onClick={() => handleOpenTask(t)}
                />
              ))}
              <DragOverlay>
                {overlay ? <ItemOverlay name={overlay} /> : null}
              </DragOverlay>
            </SortableContext>
          </tbody>
        </table>
      </div>
    </DndContext>
  )
}

function SortableItem({ element, onClick, onDeleteElement }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: element?.$id,
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
    <tr
      ref={setNodeRef}
      style={style}
      {...attributesFixed}
      {...listeners}
      className="hover:border-0 hover:bg-neutral-600/10 hover:shadow-xl"
      onClick={onClick}
    >
      <th className="rounded-l-box py-2">
        <label>
          <input type="checkbox" className="checkbox-primary checkbox" />
        </label>
      </th>
      <td className="w-full rounded-r-box py-0">
        <div className="flex items-center justify-between">
          <div className="font-bold">{element?.name}</div>
          <ul className="inline-flex">
            <li className="tooltip" data-tip="Edit name">
              <button className="btn btn-square btn-ghost btn-sm">
                <PenIcon />
              </button>
            </li>
            <li className="tooltip" data-tip="Add comment">
              <button className="btn btn-square btn-ghost btn-sm">
                <CommentIcon />
              </button>
            </li>
            <li className="tooltip" data-tip="Options">
              <ElementMenu id={element.$id} onDeleteElement={onDeleteElement} />
            </li>
          </ul>
        </div>
      </td>
    </tr>
  )
}

function ItemOverlay({ name }: any) {
  return (
    <div className="flex items-center rounded-box border-0 bg-neutral-600/10 p-3 shadow-xl">
      <div>
        <label>
          <input type="checkbox" className="checkbox" />
        </label>
      </div>
      <div className="ml-8 w-full">
        <div className="font-bold">{name}</div>
      </div>
    </div>
  )
}
