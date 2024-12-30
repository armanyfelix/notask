import {
  add,
  set,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isAfter,
  isBefore,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from 'date-fns'
import { useEffect } from 'react'
import ChevronLeftIcon from '../../assets/svgs/chevronLeft.svg?react'
import ChevronRightIcon from '../../assets/svgs/chevronRight.svg?react'
import { Signal, signal } from '@preact/signals-react'
import { enUS } from 'date-fns/locale'
import { classNames } from '../../utils'

const years: number[] = []

for (let year = 2038; year >= 1980; year--) {
  years.push(year)
}

interface Props {
  dates: any
  setDates: any
  duration: Signal<boolean>
}
const today = startOfToday()
const pickMonthOpen = signal<boolean>(false)
const currentMonth = signal<any>(format(today, 'MMM-yyyy'))
const pickYearOpen = signal<boolean>(false)
export default function Calendar({ dates, setDates, duration }: Props) {
  const firstDayCurrentMonth = parse(currentMonth.value, 'MMM-yyyy', new Date())

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    currentMonth.value = format(firstDayNextMonth, 'MMM-yyyy')
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    currentMonth.value = format(firstDayNextMonth, 'MMM-yyyy')
  }
  function previousYear() {
    const firstDayNextYear = add(firstDayCurrentMonth, { years: -1 })
    currentMonth.value = format(firstDayNextYear, 'MMM-yyyy')
  }

  function nextYear() {
    const firstDayNextYear = add(firstDayCurrentMonth, { years: 1 })
    currentMonth.value = format(firstDayNextYear, 'MMM-yyyy')
  }

  function setMonth(m: number) {
    const month = set(firstDayCurrentMonth, { month: m })
    currentMonth.value = format(month, 'MMM-yyyy')
  }

  function setYear(y: number) {
    const year = set(firstDayCurrentMonth, { year: y })
    currentMonth.value = format(year, 'MMM-yyyy')
  }

  // const selectedDayMeetings = meetings.filter((meeting) =>
  //   isSameDay(parseISO(meeting.startDatetime), selectedDay),
  // )

  const setDatesHandle = (day: any) => {
    if (!duration.value) {
      setDates({ ...dates, start_date: day })
    } else {
      if (dates?.start_date <= day) {
        setDates({ ...dates, end_date: day })
      } else {
        setDates({ ...dates, start_date: day })
      }
    }
  }

  useEffect(() => {
    if (format(dates?.start_date, 'MMM-yyyy') !== currentMonth.value) {
      setMonth(dates.start_date.getMonth())
    }
  }, [dates, dates?.start_date])

  return (
    <div className="mt-3">
      {pickMonthOpen.value ? (
        <>
          <div className="flex items-center justify-evenly">
            <button
              type="button"
              className="btn btn-square btn-ghost btn-sm tooltip"
              data-tip="Previous month"
              onClick={previousYear}
            >
              <ChevronLeftIcon />
            </button>
            <button
              className="btn btn-ghost btn-sm font-semibold"
              onClick={() => (pickYearOpen.value = !pickYearOpen.value)}
            >
              {format(firstDayCurrentMonth, 'yyyy')}
            </button>
            <button
              onClick={nextYear}
              type="button"
              className="btn btn-square btn-ghost btn-sm tooltip"
              data-tip="Next Month"
            >
              <ChevronRightIcon />
            </button>
          </div>
          {pickYearOpen.value ? (
            <ul className="menu menu-horizontal sticky bottom-20 h-48 w-full justify-between overflow-y-auto">
              {years?.map((y) => (
                <li key={y}>
                  <button
                    className={classNames(
                      y === firstDayCurrentMonth.getFullYear() && 'active',
                      y === today.getFullYear() && '!text-primary',
                    )}
                    onClick={() => {
                      setYear(y)
                      pickYearOpen.value = false
                    }}
                  >
                    {y}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="menu menu-horizontal w-full justify-between">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
                <li key={m}>
                  <button
                    className={classNames(
                      m === firstDayCurrentMonth.getMonth() && 'active',
                      m === today.getMonth() &&
                        today.getFullYear() ===
                          firstDayCurrentMonth.getFullYear() &&
                        '!text-primary',
                    )}
                    onClick={() => {
                      setMonth(m)
                      pickMonthOpen.value = !pickMonthOpen.value
                    }}
                  >
                    {enUS?.localize?.month(m as any, { width: 'abbreviated' })}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => (pickMonthOpen.value = true)}
            >
              <h2 className="flex-auto font-semibold">
                {format(firstDayCurrentMonth, 'MMMM yyyy')}
              </h2>
            </button>
            <button
              type="button"
              className="btn btn-square btn-ghost btn-sm"
              onClick={previousMonth}
            >
              <ChevronLeftIcon />
            </button>
            <button
              onClick={nextMonth}
              type="button"
              className="btn btn-square btn-ghost btn-sm"
            >
              <ChevronRightIcon />
            </button>
          </div>
          <div className="mt-2 grid grid-cols-7 text-center text-xs leading-6">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>
          <div className="grid grid-cols-7 text-sm">
            {currentMonth.value &&
              days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    '',
                  )}
                >
                  <label
                    className={classNames(
                      // (!isEqual(day, dates?.start_date) ||
                      //   !isEqual(day, dates?.end_date)) &&
                      isToday(day) && 'text-primary',
                      (!isEqual(day, dates?.start_date) ||
                        !isEqual(day, dates?.end_date)) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        'text-base-content',
                      (!isEqual(day, dates?.start_date) ||
                        !isEqual(day, dates?.end_date)) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        'text-base-content/40',
                      (isEqual(day, dates?.start_date) ||
                        isEqual(day, dates?.end_date)) &&
                        isToday(day) &&
                        'bg-primary !text-primary-content',
                      (isEqual(day, dates?.start_date) ||
                        isEqual(day, dates?.end_date)) &&
                        !isToday(day) &&
                        'bg-secondary text-secondary-content',
                      duration.value &&
                        isAfter(day, dates?.start_date) &&
                        isBefore(day, dates?.end_date) &&
                        'bg-secondary/30',
                      (!isEqual(day, dates?.end_date) ||
                        !isEqual(day, dates?.end_date)) &&
                        'hover:bg-secondary/50',
                      (!isEqual(day, dates?.end_date) ||
                        !isEqual(day, dates?.end_date) ||
                        isToday(day)) &&
                        'font-semibold',
                      'mx-auto flex h-8 w-8 items-center justify-center rounded-box',
                    )}
                  >
                    <input
                      type="radio"
                      name="start_date"
                      onChange={() => setDatesHandle(day)}
                      className="sr-only"
                    />
                    <time dateTime={format(day, 'yyyy-MM-dd')}>
                      {format(day, 'd')}
                    </time>
                  </label>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  )
}

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
]
