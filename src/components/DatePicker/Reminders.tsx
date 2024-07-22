import ChevronRightIcon from '../../assets/svgs/chevronRight.svg?react'
import AlarmIcon from '../../assets/svgs/alarm.svg?react'
import CheckIcon from '../../assets/svgs/check.svg?react'
import CloseIcon from '../../assets/svgs/close.svg?react'
import { Fragment } from 'react'
import { Signal, signal } from '@preact/signals-react'
import { Button, ListBox } from 'react-aria-components'

interface Props {
  selectedReminders: Signal<any>
  createReminderOpen: Signal<boolean>
}

const reminders = signal<any>([
  {
    label: 'On 1 Day',
    value: new Date().setDate(new Date().getDate() + 1),
  },
  {
    label: 'On 3 Days',
    value: new Date().setDate(new Date().getDate() + 2),
  },
  {
    label: 'On 1 Week',
    value: new Date().setDate(new Date().getDate() + 7),
  },
  {
    label: 'On 1 Month',
    value: new Date().setMonth(new Date().getMonth() + 1),
  },
])
export default function Reminders({
  selectedReminders,
  createReminderOpen,
}: Props) {
  return (
    <ListBox
    // value={selectedReminders.value}
    // onChange={(e: any) => (selectedReminders.value = e)}
    // multiple
    >
      <Button
        className="btn btn-sm btn-wide justify-between"
        onPress={(e: any) => e.stopPropagation()}
      >
        <div
          className={`${
            selectedReminders.value.length && 'text-secondary'
          } inline-flex items-center overflow-hidden`}
        >
          <AlarmIcon />
          <span className="max-w-40 truncate text-nowrap pl-3">
            {selectedReminders.value.length
              ? selectedReminders.value.map((r: any) => r.label).join(', ')
              : 'Reminder'}
          </span>
        </div>
        {selectedReminders.value.length ? (
          <button
            className="btn btn-square btn-ghost btn-xs"
            onClick={(e: any) => {
              e.stopPropagation()
              selectedReminders.value = []
            }}
          >
            <CloseIcon className="h-3 w-3" />
          </button>
        ) : (
          <ChevronRightIcon
            className={`${true ? 'rotate-91 transform' : ''} h-4 w-4`}
          />
        )}
      </Button>
      {/* <Listbox.Options>
            {createReminderOpen.value ? (
              <div>
                <Listbox>
                  {({ open: customOpen }) => (
                    <>
                      <Listbox.Button className="btn btn-xs btn-block justify-between">
                        <Listbox.Label></Listbox.Label>
                        <ChevronRightIcon
                          className={`${
                            customOpen ? 'rotate-91 transform' : ''
                          } h-4 w-4`}
                        />
                      </Listbox.Button>
                      <Listbox.Options>
                        <ul className="menu menu-xs">
                          <li>
                            <Listbox.Option value="day">Day</Listbox.Option>
                          </li>
                          <li>
                            <Listbox.Option value="week">Week</Listbox.Option>
                          </li>
                        </ul>
                      </Listbox.Options>
                    </>
                  )}
                </Listbox>
              </div>
            ) : (
              <ul className="menu menu-sm">
                {reminders.value.map((r: { label: string; value: number }) => (
                  <li key={r.value}>
                    <Listbox.Option as={Fragment} value={r}>
                      <div
                        className={`w-full justify-between ${
                          selectedReminders.value.some(
                            (sr: any) => sr.value === r.value,
                          ) && 'bg-base-300 !text-secondary'
                        }`}
                      >
                        {r.label}
                        {selectedReminders.value.some(
                          (sr: any) => sr.value === r.value,
                        ) && <CheckIcon />}
                      </div>
                    </Listbox.Option>
                  </li>
                ))}
                <li />
                <li>
                  <Listbox.Option as={Fragment} value="custom">
                    <button onClick={() => (createReminderOpen.value = true)}>
                      Custom
                    </button>
                  </Listbox.Option>
                </li>
              </ul>
            )}
          </Listbox.Options> */}
    </ListBox>
  )
}
