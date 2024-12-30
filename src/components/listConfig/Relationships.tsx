import { Signal } from '@preact/signals-react'

interface Props {
  preset: any
  savePreset: Signal<number>
}

export default function Relationships({ preset, savePreset }: Props) {
  const relationships = preset.value.attributes.relationships.values
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
              preset.value = {
                ...preset.value,
                attributes: {
                  ...preset.value.attributes,
                  relationships: {
                    ...preset.value.attributes.relationships,
                    values: {
                      ...relationships,
                      lists: !relationships.lists,
                    },
                  },
                },
              }
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
              preset.value = {
                ...preset.value,
                attributes: {
                  ...preset.value.attributes,
                  relationships: {
                    ...preset.value.attributes.relationships,
                    values: {
                      ...relationships,
                      elements: !relationships.elements,
                    },
                  },
                },
              }
              savePreset.value = preset.value.id
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
              preset.value = {
                ...preset.value,
                attributes: {
                  ...preset.value.attributes,
                  relationships: {
                    ...preset.value.attributes.relationships,
                    values: {
                      ...relationships,
                      notes: !relationships.notes,
                    },
                  },
                },
              }
              savePreset.value = preset.value.id
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
              preset.value = {
                ...preset.value,
                attributes: {
                  ...preset.value.attributes,
                  relationships: {
                    ...preset.value.attributes.relationships,
                    values: {
                      ...relationships,
                      whiteboards: !relationships.whiteboards,
                    },
                  },
                },
              }
              savePreset.value = preset.value.id
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
              preset.value = {
                ...preset.value,
                attributes: {
                  ...preset.value.attributes,
                  relationships: {
                    ...preset.value.attributes.relationships,
                    values: {
                      ...relationships,
                      dependencies: !relationships.dependencies,
                    },
                  },
                },
              }
              savePreset.value = preset.value.id
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
              preset.value = {
                ...preset.value,
                attributes: {
                  ...preset.value.attributes,
                  relationships: {
                    ...preset.value.attributes.relationships,
                    values: {
                      ...relationships,
                      urls: !relationships.urls,
                    },
                  },
                },
              }
              savePreset.value = preset.value.id
            }}
          />
        </li>
      </ul>
    </div>
  )
}
