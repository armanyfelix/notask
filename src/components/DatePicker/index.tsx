import SunIcon from "../../assets/svgs/sun.svg?react";
// import AddCalendarIcon from '../assets/svgs/addCalendar.svg?react'
import ChevronRightIcon from "../../assets/svgs/chevronRight.svg?react";
import TomorrowIcon from "../../assets/svgs/tomorrow.svg?react";
import NextWeekIcon from "../../assets/svgs/nextWeek.svg?react";
import ClockIcon from "../../assets/svgs/clock.svg?react";
import MoonIcon from "../../assets/svgs/moon.svg?react";
import CloseIcon from "../../assets/svgs/close.svg?react";
import { useState } from "react";
import Recurrence from "./Recurrence";
import Calendar from "./Calendar";
import {
  addDays,
  addMonths,
  format,
  startOfToday,
  startOfTomorrow,
} from "date-fns";
import Reminders from "./Reminders";
import { Button, Popover } from "react-aria-components";

interface Props {
  children: any;
  btnStyles?: string;
  position?: string;
  dates: any;
  setDates: any;
  // settings: any
}

export default function DatePicker({
  children,
  btnStyles,
  position,
  dates,
  setDates,
  // settings,
}: Props) {
  const [duration, setDuration] = useState<boolean>(false);
  const [selectedReminders, setSelectedReminders] = useState<any>([]);
  const [selectedRecurrence, setSelectedRecurrence] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<any>(null);
  const [createReminderOpen, setCreateReminderOpen] = useState<boolean>(false);
  const [createRecurrenceOpen, setCreateRecurrenceOpen] =
    useState<boolean>(false);
  const [customRecurrence, setCustomRecurrence] = useState<any>({
    every: 1,
    by: "day",
    on_date: 1,
    by_week: null,
    by_week_day: null,
  });

  const today = startOfToday();
  const times: { id: number; hour: string; minutes: string; period: string }[] =
    [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 30) {
      const hour =
        i < 10 ? `0${i < 12 ? i : i - 12}` : `${i <= 12 ? i : i - 12}`;
      const minutes = j === 0 ? "00" : `${j}`;
      const period = i >= 12 ? "PM" : "AM";
      times.push({
        id: i,
        hour,
        minutes,
        period,
      });
    }
  }
  return (
    <Popover className="relative">
      <Button className={btnStyles || ""}>{children}</Button>
      {/* <Popover.Panel
          className={`absolute rounded-box ${
            position ? position : 'bottom-12 right-0'
          } z-50 flex cursor-auto bg-base-300/80 p-3 backdrop-blur-xl`}
        >
          <div>
            <div className="tabs-boxed tabs tabs-sm flex-nowrap">
              <button
                onClick={() => {
                  setDuration(false)
                  setDates({ ...dates, end_date: null })
                }}
                className={`tab ${!duration && 'tab-active'}`}
              >
                Date
              </button>
              <button
                onClick={() => setDuration(true)}
                className={`tab ${duration && 'tab-active'}`}
              >
                Duration
              </button>
            </div>
            {duration ? (
              <div>
                <div className="form-control mt-2">
                  <label className="label">
                    <span className="label-text pr-1 text-lg">Start </span>
                    <div className="join">
                      <input
                        type="date"
                        className="input input-xs join-item input-bordered"
                        value={
                          dates?.start_date
                            ? format(dates?.start_date, 'yyyy-MM-dd')
                            : ''
                        }
                      />
                      <input
                        type="time"
                        className="input input-xs join-item input-bordered"
                        value={selectedTime}
                      />
                    </div>
                  </label>
                  <label className="label">
                    <span className="label-text pr-1 text-lg">End </span>
                    <div className="join">
                      <input
                        type="date"
                        className="input input-xs join-item input-bordered"
                        value={
                          dates?.end_date
                            ? format(dates?.end_date, 'yyyy-MM-dd')
                            : ''
                        }
                      />
                      <input
                        type="time"
                        className="input input-xs join-item input-bordered"
                      />
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              <ul className="menu menu-horizontal flex-nowrap">
                <li>
                  <button
                    className={`${
                      dates && dates?.start_date === today && 'active'
                    } tooltip`}
                    data-tip="Today"
                    onClick={() => {
                      setDates({
                        ...dates,
                        start_date: today,
                      })
                    }}
                  >
                    <SunIcon />
                  </button>
                </li>
                <li>
                  <button
                    className={`${
                      dates?.start_date === startOfTomorrow() && 'active'
                    } tooltip`}
                    data-tip="Tomorrow"
                    onClick={() => {
                      setDates({
                        ...dates,
                        start_date: startOfTomorrow(),
                      })
                    }}
                  >
                    <TomorrowIcon />
                  </button>
                </li>
                <li>
                  <button
                    className={`${
                      dates?.start_date === addDays(today, 7) && 'active'
                    } tooltip`}
                    data-tip="Next week"
                    onClick={() => {
                      setDates({
                        ...dates,
                        start_date: addDays(today, 7),
                      })
                    }}
                  >
                    <NextWeekIcon />
                  </button>
                </li>
                <li>
                  <button
                    className={`${
                      dates?.start_date ===
                        new Date().setMonth(new Date().getMonth() + 1) &&
                      'active'
                    } tooltip`}
                    data-tip="Next Month"
                    onClick={() => {
                      setDates({
                        ...dates,
                        start_date: addMonths(today, 1),
                      })
                    }}
                  >
                    <MoonIcon />
                  </button>
                </li>
              </ul>
            )}

            <Calendar dates={dates} setDates={setDates} duration={duration} />
          </div>
          <div className="space-y-1 pl-3">
            {!duration && (
              <Listbox
                value={selectedTime}
                onChange={(e: any) => setSelectedTime(e)}
              >
                {({ open }) => (
                  <>
                    <Listbox.Button
                      className="btn btn-sm btn-wide justify-between"
                      onClick={(e: any) => e.stopPropagation()}
                    >
                      <div
                        className={`${
                          selectedTime && 'text-secondary'
                        } inline-flex items-center`}
                      >
                        <ClockIcon />
                        <span className="max-w-40 pl-3">
                          {selectedTime || open ? (
                            <>
                              <input
                                type="time"
                                className="appearance-none bg-transparent outline-none"
                                value={selectedTime || '00:00'}
                                onInput={(e: any) => {
                                  setSelectedTime(e.target.value)
                                  // console.log(set)
                                }}
                                onClick={(e: any) => e.stopPropagation()}
                              />
                            </>
                          ) : (
                            'Time'
                          )}
                        </span>
                      </div>
                      {selectedTime ? (
                        <button
                          className="btn btn-square btn-ghost btn-xs"
                          onClick={(e: any) => {
                            e.stopPropagation()
                            setSelectedTime(null)
                          }}
                        >
                          <CloseIcon className="h-3 w-3" />
                        </button>
                      ) : (
                        <ChevronRightIcon
                          className={`${open ? 'rotate-91 transform' : ''} h-4 w-4`}
                        />
                      )}
                    </Listbox.Button>
                    <Listbox.Options className="max-h-60 overflow-y-auto">
                      <ul className="menu-s menu menu-vertical">
                        {times?.map((time, index) => (
                          <li key={index}>
                            <Listbox.Option
                              className={`${
                                selectedTime ===
                                  `${
                                    time?.period === 'AM'
                                      ? time?.hour
                                      : Number(time?.hour) === 12
                                        ? Number(time?.hour)
                                        : Number(time?.hour) + 12
                                  }:${time?.minutes}` &&
                                'active !text-secondary'
                              }`}
                              value={`${
                                time?.period === 'AM'
                                  ? time?.hour
                                  : Number(time?.hour) === 12
                                    ? Number(time?.hour)
                                    : Number(time?.hour) + 12
                              }:${time?.minutes}`}
                            >
                              {time.hour}:{time.minutes} {time.period}
                            </Listbox.Option>
                          </li>
                        ))}
                      </ul>
                    </Listbox.Options>
                  </>
                )}
              </Listbox>
            )}
            <Reminders
              selectedReminders={selectedReminders}
              createReminderOpen={createReminderOpen}
            />
            <Recurrence
              createRecurrenceOpen={createRecurrenceOpen}
              customRecurrence={customRecurrence}
              selectedRecurrence={selectedRecurrence}
              settings={settings}
            />
          </div>
        </Popover.Panel> */}
    </Popover>
  );
}
