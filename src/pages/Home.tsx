import { AccountState, useAccountStore } from '../utils/zustand'
import SunCloudIcon from '../assets/weather/sunCloud.svg?react'
import ChevronRightIcon from '../assets/svgs/chevronRight.svg?react'
import ChevronLeftIcon from '../assets/svgs/chevronLeft.svg?react'
import CalendarIcon from '../assets/svgs/calendar.svg?react'
import GoogleCalendarIcon from '../assets/icons/googleCalendar.svg?react'
import { format } from 'date-fns'
import { useMemo } from 'react'
import { signal } from '@preact/signals-react'
import {
  Button,
  Calendar,
  CalendarCell,
  CalendarGrid,
  DatePicker,
  Dialog,
  Group,
  Heading,
  Popover,
} from 'react-aria-components'

const events = signal<any>([
  {
    id: 1,
    title: 'Shane Gillis Stand-Up Monologue - SNL',
  },
])

export default function Home({}: any) {
  const today = useMemo(() => {
    return new Date()
  }, [])
  const user = useAccountStore((s: AccountState) => s.account)
  return (
    <div className="h-screen overflow-auto rounded-xl m-1 bg-gradient-to-tr from-primary/20 to-secondary/20">
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center">
          <SunCloudIcon className="h-14 w-14" />
          <h1 className="ml-8 text-4xl font-extrabold">
            Good afternoon, {user?.name}
          </h1>
        </div>
        <div>
          <Button className="btn btn-primary">Create</Button>
        </div>
      </header>
      <div className="grid grid-cols-3 gap-6 px-6">
        <Agenda today={today} />
        <Notifications />
        <Recent />
        <ToDos />
      </div>
      {/* <div className="bg-base-20 mt-40 p-10">footer</div> */}
    </div>
  )
}

const Agenda = ({ today }: any) => {
  return (
    <div className="card col-span-2 bg-base-200 shadow-xl shadow-base-300">
      <div className="card-body">
        <div className="card-title justify-between">
          <div className="flex items-center space-x-1">
            <div className="text-xl">{format(today, 'MMM')}</div>
            <div className="text-2xl font-bold">{format(today, 'd')}</div>,
            <div className="text-xl">{format(today, 'EEEE')}</div>
          </div>
          <div className="flex items-center">
            <button className="btn btn-square">
              <ChevronLeftIcon />
            </button>
            <button className="btn btn-square">
              <ChevronRightIcon />
            </button>
            <DatePicker>
              <Group>
                <Button>
                  <CalendarIcon />
                </Button>
              </Group>
              <Popover>
                <Dialog>
                  <Calendar className="card card-compact bg-base-300">
                    <div className="card-body">
                      <header className="flex items-center justify-between">
                        <Button slot="previous">◀</Button>
                        <Heading />
                        <Button slot="next">▶</Button>
                      </header>
                      <CalendarGrid>
                        {(date) => <CalendarCell date={date} />}
                      </CalendarGrid>
                    </div>
                  </Calendar>
                </Dialog>
              </Popover>
            </DatePicker>
          </div>
        </div>
        <div className="max-h-72 overflow-auto">
          {events.value ? (
            events.value.map((e: any, i: number) => (
              <button
                key={i}
                className="btn btn-active btn-block justify-between"
              >
                <div className="flex items-center">
                  <div className="mr-5">
                    <GoogleCalendarIcon />
                  </div>
                  <div className="text-lg font-semibold">{e.title}</div>
                </div>
                <div>date - time</div>
              </button>
            ))
          ) : (
            <div className="text-center text-3xl font-bold text-base-content/60">
              You have no events scheduled for today
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const Notifications = () => {
  return (
    <div className="card bg-base-200 shadow-xl shadow-base-300">
      <div className="card-body">
        <div className="card-title">Notifications</div>
        <div className="max-h-72 overflow-auto">
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
        </div>
      </div>
    </div>
  )
}

const Recent = () => {
  return (
    <div className="card bg-base-200 shadow-xl shadow-base-300">
      <div className="card-body">
        <div className="card-title">Recent</div>
        <div className="max-h-72 overflow-auto">mine set</div>
      </div>
    </div>
  )
}

const ToDos = () => {
  return (
    <div className="card col-span-2 bg-base-200 shadow-xl shadow-base-300">
      <div className="card-body">
        <div className="card-title">to do'ß</div>
        <div className="max-h-72 overflow-auto">
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is the life we live</div>
          <div>This is t</div>
        </div>
      </div>
    </div>
  )
}
