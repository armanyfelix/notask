interface Props {
  preset: any;
  savePreset: number;
  setSavePreset: (value: number) => void;
}

export default function Dates({ preset, savePreset, setSavePreset }: Props) {
  const dates = preset.attributes.dates.values;

  return (
    <div className="mb-5">
      <p className="mb-10 text-sm leading-3">
        Allows users to set deadlines for tasks, receive reminders, view tasks
        on a calendar, set recurring tasks, and sort tasks by due date.
      </p>
      <ul className="mx-8 space-y-3 text-lg">
        {" "}
        <li className="flex items-center justify-between">
          Date
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={dates.start_date}
            onInput={() => {
              preset = {
                ...preset,
                attributes: {
                  ...preset.attributes,
                  dates: {
                    ...preset.attributes.dates,
                    values: {
                      ...dates,
                      start_date: !dates.start_date,
                    },
                  },
                },
              };
              setSavePreset(preset.id);
            }}
          />
        </li>
        <li className="flex items-center justify-between">
          Duration
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={dates.end_date}
            onInput={() => {
              preset = {
                ...preset,
                attributes: {
                  ...preset.attributes,
                  dates: {
                    ...preset.attributes.dates,
                    values: {
                      ...dates,
                      end_date: !dates.end_date,
                    },
                  },
                },
              };
              setSavePreset(preset.id);
            }}
          />
        </li>
        <li className="flex items-center justify-between">
          Reminders
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={dates.reminders}
            onInput={() => {
              preset = {
                ...preset,
                attributes: {
                  ...preset.attributes,
                  dates: {
                    ...preset.attributes.dates,
                    values: {
                      ...dates,
                      reminders: !dates.reminders,
                    },
                  },
                },
              };
              setSavePreset(preset.id);
            }}
          />
        </li>
        <li className="flex items-center justify-between">
          Recurrence
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={dates.recurrence}
            onInput={() => {
              preset = {
                ...preset,
                attributes: {
                  ...preset.attributes,
                  dates: {
                    ...preset.attributes.dates,
                    values: {
                      ...dates,
                      recurrence: !dates.recurrence,
                    },
                  },
                },
              };
              setSavePreset(preset.id);
            }}
          />
        </li>
      </ul>
    </div>
  );
}
