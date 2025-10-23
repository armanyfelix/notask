interface Props {
  preset: any;
  savePreset: number;
  setSavePreset: (value: number) => void;
}

export default function Relationships({
  preset,
  savePreset,
  setSavePreset,
}: Props) {
  const relationships = preset.attributes.relationships.values;
  return (
    <div>
      <p className="mb-10 text-sm leading-3">
        Allows users to set deadlines for tasks, receive reminders, view tasks
        on a calendar, set recurring tasks, and sort tasks by due date.
      </p>
      <ul className="mx-8 mb-6 space-y-3 text-lg">
        <li className="flex items-center justify-between">
          Lists
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={relationships.lists}
            onInput={() => {
              preset = {
                ...preset,
                attributes: {
                  ...preset.attributes,
                  relationships: {
                    ...preset.attributes.relationships,
                    values: {
                      ...relationships,
                      lists: !relationships.lists,
                    },
                  },
                },
              };
              setSavePreset(preset.id);
            }}
          />
        </li>
        <li className="flex items-center justify-between">
          List Elements
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={relationships.elements}
            onInput={() => {
              preset = {
                ...preset,
                attributes: {
                  ...preset.attributes,
                  relationships: {
                    ...preset.attributes.relationships,
                    values: {
                      ...relationships,
                      elements: !relationships.elements,
                    },
                  },
                },
              };
              setSavePreset(preset.id);
            }}
          />
        </li>
        <li className="flex items-center justify-between">
          Notes
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={relationships.notes}
            onInput={() => {
              preset = {
                ...preset,
                attributes: {
                  ...preset.attributes,
                  relationships: {
                    ...preset.attributes.relationships,
                    values: {
                      ...relationships,
                      notes: !relationships.notes,
                    },
                  },
                },
              };
              setSavePreset(preset.id);
            }}
          />
        </li>
        <li className="flex items-center justify-between">
          Whiteboards
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={relationships.whiteboards}
            onInput={() => {
              preset = {
                ...preset,
                attributes: {
                  ...preset.attributes,
                  relationships: {
                    ...preset.attributes.relationships,
                    values: {
                      ...relationships,
                      whiteboards: !relationships.whiteboards,
                    },
                  },
                },
              };
              setSavePreset(preset.id);
            }}
          />
        </li>
        <li className="flex items-center justify-between">
          Dependencies
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={relationships.dependencies}
            onInput={() => {
              preset = {
                ...preset,
                attributes: {
                  ...preset.attributes,
                  relationships: {
                    ...preset.attributes.relationships,
                    values: {
                      ...relationships,
                      dependencies: !relationships.dependencies,
                    },
                  },
                },
              };
              setSavePreset(preset.id);
            }}
          />
        </li>
        <li className="flex items-center justify-between">
          External url's
          <input
            type="checkbox"
            className="toggle toggle-secondary toggle-sm"
            checked={relationships.urls}
            onInput={() => {
              preset = {
                ...preset,
                attributes: {
                  ...preset.attributes,
                  relationships: {
                    ...preset.attributes.relationships,
                    values: {
                      ...relationships,
                      urls: !relationships.urls,
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
