import { Signal } from '@preact/signals-react'
import { useEffect } from 'react'

interface Props {
  config: Signal<any>
  savePreset: Signal<string>
}

export default function Dates({ config, savePreset }: Props) {
  useEffect(() => {
    console.log('config.value :>> ', config.value)
  }, [config])

  return (
    <div className="p-8">
      <p className="mb-10 text-sm leading-3">
        Allows users to set deadlines for tasks, receive reminders, view tasks
        on a calendar, set recurring tasks, and sort tasks by due date.
      </p>
      <ul className="mx-8 space-y-3 text-lg">
        <li className="flex items-center justify-between">
          Start Date
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={config.value.schedule.options.start_date}
            onInput={() => {
              const newValue = !config.value.schedule.options.start_date
              config.value = {
                ...config.value,
                schedule: {
                  ...config.value.schedule,
                  options: {
                    ...config.value.schedule.options,
                    start_date: newValue,
                  },
                },
              }
              savePreset.value = config.value.name
            }}
          />
        </li>
        <li className="flex items-center justify-between">
          Finish Date
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={config.value.schedule.options.finish_date}
            // onInput={() => {
            //   preset.value = {
            //     ...preset.value,
            //     attributes: {
            //       ...preset.value.attributes,
            //       dates: {
            //         ...preset.value.attributes.dates,
            //         values: {
            //           ...dates,
            //           end_date: !dates.end_date,
            //         },
            //       },
            //     },
            //   }
            //   savePreset.value = preset.value.id
            // }}
          />
        </li>
        <li className="flex items-center justify-between">
          Reminders
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={config.value.schedule.options.reminders}
            // onInput={() => {
            //   preset.value = {
            //     ...preset.value,
            //     attributes: {
            //       ...preset.value.attributes,
            //       dates: {
            //         ...preset.value.attributes.dates,
            //         values: {
            //           ...dates,
            //           reminders: !dates.reminders,
            //         },
            //       },
            //     },
            //   }
            //   savePreset.value = preset.value.id
            // }}
          />
        </li>
        <li className="flex items-center justify-between">
          Recurrency
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={config.value.schedule.options.recurrency}
            // onInput={() => {
            //   preset.value = {
            //     ...preset.value,
            //     attributes: {
            //       ...preset.value.attributes,
            //       dates: {
            //         ...preset.value.attributes.dates,
            //         values: {
            //           ...dates,
            //           recurrence: !dates.recurrence,
            //         },
            //       },
            //     },
            //   }
            //   savePreset.value = preset.value.id
            // }}
          />
        </li>
      </ul>
    </div>
  )
}
