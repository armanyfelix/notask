import { Signal, signal } from "@preact/signals-react";
import PlusIcon from "../../assets/svgs/plus.svg?react";
import TrashIcon from "../../assets/svgs/trash.svg?react";
import fieldTypes from "../../data/fields.json";
import { useEffect, useRef } from "react";
import Confirm from "../common/Confirm";
import { Button, ListBox } from "react-aria-components";

interface Props {
  preset: any;
  savePreset: Signal<number>;
}

const addField = signal<boolean>(false);
const newFieldName = signal<string>("");
const newFieldType = signal<string>("");
const newFieldRequired = signal<boolean>(false);
const error = signal<string>("");
const confirmDelete = signal<any>(null);
const openConfirm = signal<boolean>(false);

export default function Fields({ preset, savePreset }: Props) {
  const fields = preset.value.attributes.fields.values;
  const refs = fields.map(() => useRef(undefined));
  const newFieldRef = useRef<any>(null);

  const onRename = (newName: string, field: any, index: number) => {
    if (!newName) {
      error.value = "Field name cannot be empty";
      refs[index].current.textContent = fields[index].name;
      return;
    }
    if (
      fields.some(
        (p: any) =>
          p.name.trim().toLowerCase() === newName.trim().toLowerCase(),
      )
    ) {
      error.value = "Field already exists";
      refs[index].current.textContent = fields[index].name;
      return;
    }
    if (newName.length >= 20) {
      error.value = "The field name it's too long.";
      refs[index].current.textContent = fields[index].name;
      return;
    }
    const renamedField = {
      ...field,
      name: newName.trim(),
    };
    const newFieldsValues = fields;
    newFieldsValues.splice(index, 1, renamedField);
    preset.value = {
      ...preset.value,
      attributes: {
        ...preset.value.attributes,
        fields: {
          active: preset.value.attributes.fields.active,
          values: newFieldsValues,
        },
      },
    };
    error.value = "";
    savePreset.value = preset.value.id;
  };

  const onChangeType = (type: string, field: any, index: number) => {
    if (!type) {
      error.value = "The field type it's required.";
      return;
    }
    const newTypeField = {
      ...field,
      type,
    };
    const newFieldsValues = fields;
    newFieldsValues.splice(index, 1, newTypeField);
    preset.value = {
      ...preset.value,
      attributes: {
        ...preset.value.attributes,
        fields: {
          active: preset.value.attributes.fields.active,
          values: newFieldsValues,
        },
      },
    };
    savePreset.value = preset.value.id;
  };

  const onChangeRequired = (required: boolean, field: any, index: number) => {
    const newTypeField = {
      ...field,
      required,
    };
    const newFieldsValues = fields;
    newFieldsValues.splice(index, 1, newTypeField);
    preset.value = {
      ...preset.value,
      attributes: {
        ...preset.value.attributes,
        fields: {
          active: preset.value.attributes.fields.active,
          values: newFieldsValues,
        },
      },
    };
    savePreset.value = preset.value.id;
  };

  const onDelete = (_field: any, index: number) => {
    const newFields = fields;
    newFields.splice(index, 1);
    preset.value = {
      ...preset.value,
      attributes: {
        ...preset.value.attributes,
        fields: {
          active: preset.value.attributes.fields.active,
          values: newFields,
        },
      },
    };
    savePreset.value = preset.value.id;
    openConfirm.value = false;
    confirmDelete.value = null;
  };

  const onAddField = () => {
    if (!newFieldName.value) {
      error.value = "Field name cannot be empty";
      return;
    }
    if (
      fields.some(
        (p: any) =>
          p.name.trim().toLowerCase() ===
          newFieldName.value.trim().toLowerCase(),
      )
    ) {
      error.value = "Field already exists";
      return;
    }
    if (newFieldName.value.length >= 20) {
      error.value = "The field name it's too long.";
      return;
    }
    if (!newFieldType.value) {
      error.value = "The field type it's required.";
      return;
    }
    const newFieldsValues = fields;
    newFieldsValues.push({
      id: Date.now(),
      name: newFieldName.value.trim(),
      type: newFieldType.value,
      required: newFieldRequired.value,
    });
    preset.value = {
      ...preset.value,
      attributes: {
        ...preset.value.attributes,
        fields: {
          active: preset.value.attributes.fields.active,
          values: newFieldsValues,
        },
      },
    };
    error.value = "";
    savePreset.value = preset.value.id;
    addField.value = false;
  };

  useEffect(() => {
    if (newFieldRef.current && addField.value) {
      newFieldRef.current.focus();
      const range = document.createRange();
      range.selectNodeContents(newFieldRef.current);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [addField.value]);

  return (
    <div className="relative mb-6">
      <p className="mb-8 mt-3 text-sm leading-3 antialiased">
        Add all the custom fields you want to organize different type of values
        on a table structure with diffente options and formats to your specific
        use case.
      </p>
      <table className="table static">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Required</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {fields?.map((field: any, index: number) => (
            <tr className="odd:bg-base-200 even:bg-base-100">
              <td>
                <span
                  role="textbox"
                  contentEditable
                  ref={refs[index]}
                  className="block min-w-[50px] outline-none"
                  onBlur={(e: any) =>
                    onRename(e.target.textContent, field, index)
                  }
                  onKeyPress={(e) =>
                    e.key === "Enter" && refs[index].current.blur()
                  }
                >
                  {field.name}
                </span>
              </td>
              <td>
                <ListBox
                // value={field.type}
                // onChange={(e) => onChangeType(e, field, index)}
                >
                  <Button className="select select-sm whitespace-nowrap bg-transparent">
                    {field.type || "Select type"}
                  </Button>
                  {/* <Listbox.Options className=" absolute z-50 w-full -translate-x-80 rounded-box bg-neutral p-4">
                    <div className="menu max-h-52 overflow-auto p-0">
                      {fieldTypes.map((t: string, i: number) => (
                        <li key={i}>
                          <Listbox.Option value={t} className="capitalize">
                            {t}
                          </Listbox.Option>
                        </li>
                      ))}
                    </div>
                  </Listbox.Options> */}
                </ListBox>
              </td>
              <td>
                <label>
                  <input
                    type="checkbox"
                    checked={field.required}
                    className="checkbox checkbox-sm"
                    onInput={() =>
                      onChangeRequired(!field.required, field, index)
                    }
                  />
                </label>
              </td>
              <td>
                <button
                  className="btn btn-square btn-ghost btn-sm text-error"
                  onClick={() => {
                    confirmDelete.value = {
                      type: "delete",
                      title: "Delete Field",
                      element: field,
                      index,
                    };
                    openConfirm.value = true;
                  }}
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
          {addField.value ? (
            <tr className="ring ring-neutral odd:bg-base-200 even:bg-base-100">
              <td className="">
                <span
                  role="textbox"
                  contentEditable
                  ref={newFieldRef}
                  className="focus block min-w-[50px] outline-none"
                  onInput={(e: any) =>
                    (newFieldName.value = e.target.textContent)
                  }
                  onKeyPress={(e) => e.key === "Enter" && e.preventDefault()}
                >
                  New Field
                </span>
              </td>
              <td>
                <ListBox
                // value={newFieldType.value}
                // onChange={(e: string) => (newFieldType.value = e)}
                >
                  <Button className="select select-sm whitespace-nowrap bg-transparent">
                    {newFieldType.value || "Select type"}
                  </Button>
                  {/* <Listbox.Options className=" absolute z-50 w-full -translate-x-80 rounded-box bg-neutral p-4">
                    <div className="menu max-h-52 overflow-auto p-0">
                      {fieldTypes.map((t: string, i: number) => (
                        <li key={i}>
                          <Listbox.Option value={t}>{t}</Listbox.Option>
                        </li>
                      ))}
                    </div>
                  </Listbox.Options> */}
                </ListBox>
              </td>
              <td>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={newFieldRequired.value}
                    onInput={() =>
                      (newFieldRequired.value = !newFieldRequired.value)
                    }
                  />
                </label>
              </td>
              <td>
                <button
                  className="btn btn-ghost btn-sm text-accent"
                  onClick={() => onAddField()}
                >
                  Save
                </button>
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
      <div className="mt-3 text-center">
        {error.value && (
          <span className="w-full text-center text-error">{error.value}</span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-center text-center">
        {addField.value ? (
          <button
            className="btn btn-outline btn-sm btn-wide mr-5"
            onClick={() => (addField.value = false)}
          >
            Cancel
          </button>
        ) : (
          <button
            className="btn btn-secondary btn-sm btn-wide"
            onClick={() => {
              addField.value = true;
              error.value = "";
            }}
          >
            <PlusIcon />
            Add new field
          </button>
        )}
      </div>
      <Confirm
      // data={confirmDelete}
      // open={openConfirm}
      // handleConfirm={onDelete}
      />
    </div>
  );
}
