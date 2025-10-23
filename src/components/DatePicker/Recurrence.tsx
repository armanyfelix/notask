import RecurrenceIcon from "../../assets/svgs/recurrence.svg?react";
import CloseIcon from "../../assets/svgs/close.svg?react";
import ChevronDownIcon from "../../assets/svgs/chevronDown.svg?react";
import ChevronRightIcon from "../../assets/svgs/chevronRight.svg?react";
import { Button } from "react-aria-components";

const weekDays = ["su", "mo", "tu", "we", "th", "fr", "sa"];

interface Props {
  selectedRecurrence: any;
  setSelectedRecurrence: (value: any) => void;
  customRecurrence: any;
  setCustomRecurrence: (value: any) => void;
  createRecurrenceOpen: boolean;
  setCreateRecurrenceOpen: (value: boolean) => void;
  settings: any;
}

const recurrences = [
  {
    label: "Daily",
    value: new Date().setDate(new Date().getDate() + 1),
  },
  {
    label: "Weekly",
    value: new Date().setDate(new Date().getDate() + 7),
  },
  {
    label: "Monthly",
    value: new Date().setMonth(new Date().getMonth() + 1),
  },
  {
    label: "Yearly",
    value: new Date().setFullYear(new Date().getFullYear() + 1),
  },
];
export default function Recurrence({
  selectedRecurrence,
  setSelectedRecurrence,
  customRecurrence,
  setCustomRecurrence,
  createRecurrenceOpen,
  setCreateRecurrenceOpen,
  settings,
}: Props) {
  return (
    <div>
      <Button className="btn btn-sm btn-wide justify-between">
        <div
          className={`${
            selectedRecurrence && "text-secondary"
          } inline-flex items-center`}
        >
          <RecurrenceIcon />
          <span className="max-w-40 truncate text-nowrap pl-3">
            {selectedRecurrence ? selectedRecurrence.label : "Recurrence"}
          </span>
        </div>
        {selectedRecurrence ? (
          <button
            className="btn btn-square btn-ghost btn-xs"
            onClick={(e: any) => {
              e.stopPropagation();
              setCustomRecurrence({
                every: 1,
                by: "day",
              });
              setSelectedRecurrence(null);
            }}
          >
            <CloseIcon className="h-3 w-3" />
          </button>
        ) : (
          <ChevronRightIcon
            className={`${true ? "rotate-91 transform" : ""} h-4 w-4`}
          />
        )}
      </Button>
      {/* <Disclosure.Panel className="px-5 py-3 text-center">
            <Listbox
              value={selectedRecurrence}
              onChange={(e: any) => {
                setSelectedRecurrence(e)
                if (createRecurrenceOpen) {
                  setCreateRecurrenceOpen(false)
                }
              }}
            >
              {({ open }) => (
                <>
                  <Listbox.Button className="input input-sm input-bordered flex w-full items-center justify-between">
                    <div className="inline-flex items-center">
                      <span className="max-w-40 truncate text-nowrap pl-3">
                        {selectedRecurrence
                          ? selectedRecurrence.label
                          : 'Frequency'}
                      </span>
                    </div>
                    <ChevronRightIcon
                      className={`${open ? 'rotate-90 transform' : ''} h-4 w-4`}
                    />
                  </Listbox.Button>
                  <Listbox.Options className="absolute right-9 w-52 translate-y-2 rounded-box bg-base-200">
                    <ul className="menu">
                      {recurrences.map(
                        (r: { label: string; value: number }) => (
                          <li key={r.value}>
                            <Listbox.Option
                              value={r}
                              className={`${
                                selectedRecurrence?.label === r.label &&
                                'bg-base-300 !text-secondary'
                              }`}
                            >
                              {r.label}
                            </Listbox.Option>
                          </li>
                        ),
                      )}
                      <li />
                      <li onClick={() => setCreateRecurrenceOpen(true)}>
                        <Listbox.Option
                          className={`${
                            selectedRecurrence?.label === 'custom' &&
                            'bg-base-300 !text-secondary'
                          }`}
                          value={{ label: 'custom', value: null }}
                        >
                          Custom...
                        </Listbox.Option>
                      </li>
                    </ul>
                  </Listbox.Options>
                </>
              )}
            </Listbox>
            <div className="p-3">
              {createRecurrenceOpen && (
                <div>
                  <div className="flex items-center justify-between">
                    <span>Every</span>
                    <input
                      type="number"
                      className="input input-xs input-bordered w-9 outline-none"
                      value={customRecurrence?.every}
                      onChange={(e: any) =>
                        setCustomRecurrence({
                          ...customRecurrence,
                          every: e.target.value,
                        })
                      }
                    />
                    <Listbox
                      value={customRecurrence?.by}
                      onChange={(e: any) =>
                        setCustomRecurrence({
                          ...customRecurrence,
                          by: e,
                        })
                      }
                    >
                      <Listbox.Button className="input input-xs input-bordered flex items-center outline-none">
                        <span className="pl-1 pr-2">
                          {' '}
                          {customRecurrence?.by}
                        </span>
                        <ChevronDownIcon className="h-4 w-4" />
                      </Listbox.Button>
                      <Listbox.Options className="menu menu-xs absolute translate-x-10 translate-y-20 rounded-box bg-base-100 p-3">
                        <li>
                          <Listbox.Option value="day">Day</Listbox.Option>
                        </li>
                        <li>
                          <Listbox.Option value="week">Week</Listbox.Option>
                        </li>
                        <li>
                          <Listbox.Option value="month">Month</Listbox.Option>
                        </li>
                        <li>
                          <Listbox.Option value="year">Year</Listbox.Option>
                        </li>
                      </Listbox.Options>
                    </Listbox>
                  </div>
                  {customRecurrence?.by === 'week' && (
                    <div className="join mt-4">
                      {weekDays.map((d: string) => (
                        <input
                          key={d}
                          className="btn join-item btn-xs capitalize"
                          type="checkbox"
                          value={d}
                          aria-label={d}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              {customRecurrence?.by === 'month' && (
                <div>
                  <div role="tablist" className="tabs tabs-bordered">
                    <input
                      type="radio"
                      role="tab"
                      className="tab"
                      aria-label="Tab 1"
                      name="by_month"
                      checked={customRecurrence?.on_date}
                      onClick={() => {
                        if (!customRecurrence?.on_date) {
                          setCustomRecurrence({
                            ...customRecurrence,
                            on_date: 1,
                            by_week: null,
                            by_week_day: null,
                          })
                        }
                      }}
                    />
                    <div role="tabpanel" className="tab-content p-10">
                      on date
                    </div>
                    <input
                      type="radio"
                      role="tab"
                      className="tab"
                      aria-label="Tab 2"
                      name="by_month"
                      checked={customRecurrence?.by_week}
                      onClick={() => {
                        if (!customRecurrence?.by_week) {
                          setCustomRecurrence({
                            ...customRecurrence,
                            by_week: 'first',
                            by_week_day: 'mo',
                            on_date: null,
                          })
                        }
                      }}
                    />
                    <div role="tabpanel" className="tab-content p-10">
                      <Listbox
                        value={customRecurrence?.by_week}
                        onChange={(e: number) =>
                          setCustomRecurrence({
                            ...customRecurrence,
                            by_week: e,
                          })
                        }
                      >
                        <Listbox.Button className="input input-xs input-bordered flex w-full items-center justify-between capitalize outline-none">
                          <span className="pl-1 pr-2">
                            {customRecurrence?.by_week}
                          </span>
                          <ChevronDownIcon className="h-4 w-4" />
                        </Listbox.Button>
                        <Listbox.Options className="menu menu-xs absolute block max-h-56 overflow-y-auto rounded-box bg-base-100 p-3">
                          {['first', 'second', 'Third', 'Fourth', 'Last'].map(
                            (w) => (
                              <li key={w}>
                                <Listbox.Option className="capitalize" value={w}>
                                  {w}
                                </Listbox.Option>
                              </li>
                            ),
                          )}
                        </Listbox.Options>
                      </Listbox>
                      <div className="join mt-4">
                        {weekDays.map((d: string) => (
                          <input
                            key={d}
                            className="btn join-item btn-xs capitalize"
                            type="radio"
                            name="weekdays"
                            value={d}
                            aria-label={d}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  {customRecurrence.value?.on_date && (
                    <Listbox
                      value={customRecurrence.value?.on_date}
                      onChange={(e: number) =>
                        (customRecurrence.value = {
                          ...customRecurrence.value,
                          on_date: e,
                        })
                      }
                    >
                      <Listbox.Button className="input input-xs input-bordered flex w-full items-center justify-between outline-none">
                        <span className="pl-1 pr-2">
                          {customRecurrence.value?.on_date}
                        </span>
                        <ChevronDownIcon className="h-4 w-4" />
                      </Listbox.Button>
                      <Listbox.Options className="menu menu-xs absolute block max-h-56 overflow-y-auto rounded-box bg-base-100 p-3">
                        {[
                          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                          17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
                        ].map((d) => (
                          <li key={d}>
                            <Listbox.Option value={d}>{d}th</Listbox.Option>
                          </li>
                        ))}
                        <li>
                          <Listbox.Option value="last">Last Day</Listbox.Option>
                        </li>
                      </Listbox.Options>
                    </Listbox>
                  )}
                </div>
              )}

              <div className="form-control">
                {/* {customRecurrence.value?.by !== 'week' && (
                          <label className="label cursor-pointer justify-start">
                            <input
                              type="checkbox"
                              className="checkbox checkbox-sm mr-3"
                            />
                            <span className="label-text">Skip weekends</span>
                          </label>
                        )} */}

      {/* <label className="label cursor-pointer justify-start">
                  <input type="checkbox" className="checkbox checkbox-sm mr-3" />
                  <span className="label-text">
                    Create new {settings.value?.items_name || 'object'}
                  </span>
                </label>
                <label className="label cursor-pointer justify-start">
                  <input type="checkbox" className="checkbox checkbox-sm mr-3" />
                  <span className="label-text">Recurrence forever</span>
                </label>
                <div>
                  <label className="label cursor-pointer justify-start">
                    <input type="checkbox" className="checkbox checkbox-sm mr-3" />
                    <span className="label-text">Update Status to:</span>
                  </label>
                  <div className="mt-5 space-x-2 text-right">
                    <button className="btn btn-outline btn-sm">Cancel</button>
                    <button className="btn btn-primary btn-sm">Save</button>
                  </div>
                </div>
              </div>
            </div> */}
      {/* </Disclosure.Panel> */}
    </div>
  );
}
