interface Props {
  preset: any
}

export default function Timer({ preset }: Props) {
  const timer = preset.value.attributes.timer.values
  return (
    <div className="mb-5">
      <p className="mb-10 text-sm leading-3">
        Allows users to set deadlines for tasks, receive reminders, view tasks
        on a calendar, set recurring tasks, and sort tasks by due date.
      </p>
      <ul className="mx-8 space-y-3 text-lg font-semibold">
        <li className="flex items-center justify-between">
          <span>Pomodoro</span>
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={timer.pomodoro}
            onInput={() => {
              preset.value = {
                ...preset.value,
                attributes: {
                  ...preset.value.attributes,
                  timer: {
                    ...preset.value.attributes.timer,
                    values: {
                      ...timer,
                      pomodoro: {
                        ...timer.pomodoro,
                        active: !timer.pomodoro.active,
                      },
                    },
                  },
                },
              }
            }}
          />
        </li>
        <li className="flex items-center justify-between">
          Tracker
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={timer.tracker}
            onInput={() => {
              preset.value = {
                ...preset.value,
                attributes: {
                  ...preset.value.attributes,
                  timer: {
                    ...preset.value.attributes.timer,
                    values: {
                      ...timer,
                      tracker: !timer.tracker,
                    },
                  },
                },
              }
            }}
          />
        </li>
      </ul>
    </div>
  )
}
