import { useEffect } from "react";

interface Props {
  config: any;
  setConfig: (value: any) => void;
  // savePreset: string;
  setSavePreset: (value: string) => void;
}

export default function Dates({
  config,
  setConfig,
  // savePreset,
  setSavePreset,
}: Props) {
  useEffect(() => {
    console.log("config :>> ", config);
  }, [config]);

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
            checked={config.schedule.options.start_date}
            onInput={() => {
              const newValue = !config.schedule.options.start_date;
              setConfig({
                ...config,
                schedule: {
                  ...config.schedule,
                  options: {
                    ...config.schedule.options,
                    start_date: newValue,
                  },
                },
              });
              setSavePreset(config.name);
            }}
          />
        </li>
        <li className="flex items-center justify-between">
          Finish Date
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={config.schedule.options.finish_date}
            onInput={() => {
              const newValue = !config.schedule.options.finish_date;
              setConfig({
                ...config,
                schedule: {
                  ...config.schedule,
                  options: {
                    ...config.schedule.options,
                    finish_date: newValue,
                  },
                },
              });
              setSavePreset(config.name);
            }}
          />
        </li>
        <li className="flex items-center justify-between">
          Reminders
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={config.schedule.options.reminders}
            onInput={() => {
              const newValue = !config.schedule.options.reminders;
              setConfig({
                ...config,
                schedule: {
                  ...config.schedule,
                  options: {
                    ...config.schedule.options,
                    reminders: newValue,
                  },
                },
              });
              setSavePreset(config.name);
            }}
          />
        </li>
        <li className="flex items-center justify-between">
          Recurrency
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={config.schedule.options.recurrency}
            onInput={() => {
              const newValue = !config.schedule.options.recurrency;
              setConfig({
                ...config,
                schedule: {
                  ...config.schedule,
                  options: {
                    ...config.schedule.options,
                    recurrency: newValue,
                  },
                },
              });
              setSavePreset(config.name);
            }}
          />
        </li>
      </ul>
    </div>
  );
}
