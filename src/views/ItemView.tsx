import { Signal } from '@preact/signals-react'
import DatePicker from '../components/DatePicker/index.tsx'
import CloseIcon from '../assets/svgs/close.svg?react'
import PinOutlineIcon from '../assets/svgs/pinOutline.svg?react'
import PinSolidIcon from '../assets/svgs/pinSolid.svg?react'
import PlayIcon from '../assets/svgs/play.svg?react'
import PauseIcon from '../assets/svgs/pause.svg?react'
import AddDateIcon from '../assets/svgs/addCalendar.svg?react'
import PriorityMenu from '../components/PriorityMenu.tsx'
import { useEffect, useRef, useState } from 'react'
import { ChangeEvent } from 'react'
import ItemMenu from '../components/ItemMenu.tsx'
import { format } from 'date-fns'

interface Props {
  // settings: Signal<any>
  item: Signal<any>
  pinItemView: Signal<boolean>
  handlePinView: any
  onDeleteItem: any
}

// const dates = signal<any>(null)
export default function ItemView({
  // settings,
  item,
  pinItemView,
  handlePinView,
  onDeleteItem,
}: Props) {
  const refBox = useRef(null)
  const refLeft = useRef(null)
  const [dates, setDates] = useState<any>(null)

  const onClose = () => {
    item.value = null
    dates.value = null
  }

  useEffect(() => {
    if (refBox.current) {
      const resizeable: HTMLElement = refBox.current
      const styles = window.getComputedStyle(resizeable)
      let width = parseInt(styles.width, 10)
      let xCord = 0
      const onMouseMoveLeftResize = (e: any) => {
        const dx = e.clientX - xCord
        xCord = e.clientX
        width -= dx
        // if (width > 200 && width < 700) {
        resizeable.style.width = `${width}px`
        // }
      }
      const onMouseUpLeftResize = () => {
        document.removeEventListener('mousemove', onMouseMoveLeftResize)
      }
      const onMouseDownLeftResize = (e: any) => {
        xCord = e.clientX
        resizeable.style.right = styles.right
        resizeable.style.left = ''
        document.addEventListener('mouseup', onMouseUpLeftResize)
        document.addEventListener('mousemove', onMouseMoveLeftResize)
      }

      const resizerLeft = refLeft.current as any
      resizerLeft.addEventListener('mousedown', onMouseDownLeftResize)

      return () => {
        resizerLeft.removeEventListener('mousedown', onMouseDownLeftResize)
      }
    }
  }, [])

  return (
    <div className="h-full overflow-y-auto">
      <Header
        item={item}
        pinItemView={pinItemView}
        handlePinView={handlePinView}
        onDeleteItem={onDeleteItem}
        onClose={onClose}
      />
      <div className="px-5">
        {/* {settings.value.attributes?.tags?.active && <Tags />} */}
        <Tags />
        <div className="mb-8 inline-flex w-full">
          <input
            type="text"
            defaultValue={item.value?.name || ''}
            // value={element.value?.name || ''}
            onInput={(e: ChangeEvent<HTMLInputElement>) =>
              (item.value = {
                name: (e.target as HTMLInputElement).value,
                ...item.value,
              })
            }
            placeholder="Task Name"
            className="w-full bg-transparent p-2 text-4xl font-bold outline-none"
          />
        </div>
        <div className="stats stats-vertical mb-3 w-full !overflow-visible bg-transparent lg:stats-horizontal">
          {/* {settings.value.attributes?.status?.active && <Status />}
          {settings.value.attributes?.timer?.active && <Timer />}
          {settings.value.attributes?.dates?.active && (
            <Dates dates={dates} setDates={setDates} settings={settings} />
          )} */}
          {/* {settings.value.attributes?.priority?.active && <Priority />}
          {settings.value.attributes?.guests?.active && <Guests />} */}
          <Status />
          <Timer />
          <Dates dates={dates} setDates={setDates} />
          {/* <Priority /> */}
          <Guests />
        </div>
        <div>
          <textarea
            defaultValue={item.value?.description || ''}
            onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
              (item.value = {
                description: (e.target as HTMLTextAreaElement).value,
                ...item.value,
              })
            }
            rows={4}
            placeholder="Description"
            className="h-24 w-full rounded-box bg-base-100 p-3 text-xl outline-none"
          />
        </div>
        {/* {settings.value.attributes?.fields?.active && <Fields />} */}
        {/* {settings.value.attributes?.subtasks?.active && <Subtasks />} */}
        <Fields />
        <Subtasks />
      </div>
      {/* Resizer */}
      <div
        ref={refLeft}
        className="absolute top-0 h-full w-2 cursor-col-resize hover:bg-base-300"
      ></div>
    </div>
  )
}

const Fields = () => {
  return (
    <div className="collapse collapse-plus border-2 border-base-100 bg-base-200 text-xl font-semibold">
      <input type="checkbox" className="peer" />
      <div className="peer-checked:border- collapse-title">Fields</div>
      <div className="collapse-content">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Job</th>
                <th>Favorite Color</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cy Ganderton</td>
                <td>Quality Control Specialist</td>
                <td>Blue</td>
              </tr>
              <tr className="hover">
                <td>Hart Hagerty</td>
                <td>Desktop Support Technician</td>
                <td>Purple</td>
              </tr>
              <tr>
                <td>Brice Swyre</td>
                <td>Tax Accountant</td>
                <td>Red</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const Subtasks = () => {
  return (
    <>
      <div className="collapse collapse-plus border-2 border-base-100 bg-base-200 text-xl font-semibold">
        <input type="checkbox" className="peer" />
        <div className="peer-checked:border- collapse-title">Subtasks</div>
        <div className="collapse-content">
          <p>hello</p>
        </div>
      </div>
    </>
  )
}

const Tags = () => {
  return (
    <div className="mb-3 space-x-1">
      <div className="badge badge-lg">default</div>
      <div className="badge badge-neutral badge-lg">neutral</div>
      <div className="badge badge-primary badge-lg">primary</div>
      <div className="badge badge-secondary badge-lg">secondary</div>
      <div className="badge badge-accent badge-lg">accent</div>
      <div className="badge badge-ghost badge-lg">ghost</div>
      <button className="ghost btn btn-xs text-nowrap rounded-full">
        + Tag
      </button>
    </div>
  )
}

const Status = () => {
  return (
    <div className="stat">
      <div className="stat-title">Status</div>
      <div className="stat-value mx-auto">
        <label className="label cursor-pointer">
          <input
            type="checkbox"
            className="checkbox-primary checkbox checkbox-lg"
          />
        </label>
      </div>
      <div className="stat-desc">IN PROGRESS</div>
    </div>
  )
}
const Timer = () => {
  return (
    <div className="stat">
      <div className="stat-title">Timer</div>
      <div className="stat-valu mx-auto">
        <label className="swap">
          <input type="checkbox" />
          <PlayIcon className="swap-on h-10 w-10 fill-current text-success" />
          <PauseIcon className="swap-off h-10 w-10 fill-current text-error" />
        </label>
      </div>
      <div className="stat-desc">00:00:00</div>
    </div>
  )
}
const Dates = ({ dates, setDates }: any) => {
  return (
    <div className="stat">
      <div className="stat-title">Dates</div>
      <div className="stat-valu z-10">
        <DatePicker
          // settings={settings}
          dates={dates}
          setDates={setDates}
          btnStyles="btn join-item text-nowrap"
          position="top-3 -left-10"
        >
          <span className="text-xl">
            {dates?.start_date ? (
              format(dates?.start_date, 'dd/MMM/yy')
            ) : (
              <AddDateIcon />
            )}
          </span>
          {dates?.end_date && (
            <span className="text-xl">
              - {format(dates?.end_date, 'dd/MMM/yy')}
            </span>
          )}
        </DatePicker>
      </div>
      {/* <div className="stat-desc">↗︎ 400 (22%)</div> */}
    </div>
  )
}
const Priority = () => {
  return (
    <div className="stat">
      <div className="stat-title">Priority</div>
      <div className="stat-value">
        <PriorityMenu btnStyles="btn btn-ghost btn-square" position="" />
      </div>
      <div className="stat-desc">High</div>
    </div>
  )
}
const Guests = () => {
  return (
    <div className="stat">
      <div className="stat-title">Guests</div>
      <div className="stat-value">
        <div className="avatar-group -space-x-6 rtl:space-x-reverse">
          <div className="avatar">
            <div className="w-8">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <div className="avatar">
            <div className="w-8">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <div className="avatar">
            <div className="w-8">
              <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
            </div>
          </div>
          <div className="avatar placeholder">
            <div className="w-8 bg-neutral text-sm text-neutral-content">
              <span>+99</span>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="stat-desc">↘︎ 90 (14%)</div> */}
    </div>
  )
}

const Header = ({
  item,
  handlePinView,
  pinElementView,
  onDeleteTask,
  onClose,
}: any) => {
  return (
    <header className="flex items-center justify-between p-3">
      <div className="space-x-2">
        <div className="tooltip tooltip-bottom" data-tip="Close">
          <button className="btn btn-square btn-ghost btn-sm" onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
      </div>
      <div className="flex space-x-2">
        {/* <div className="tooltip tooltip-bottom" data-tip="Pin view">
          <button
            className="btn btn-square btn-ghost btn-sm"
            onClick={() => {
              handlePinView()
            }}
          >
            {pinElementView.value ? (
              <PinOutlineIcon className="w-5" />
            ) : (
              <PinSolidIcon className="w-5" />
            )}
          </button>
        </div> */}
        {/* <ItemMenu id={item.value?.id} onDeleteItem={onDeleteTask} /> */}
      </div>
    </header>
  )
}
