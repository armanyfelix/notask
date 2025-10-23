import { useEffect, useRef } from "react";
import { Signal, signal } from "@preact/signals-react";
import DotsIcon from "../../assets/svgs/dotsBold.svg?react";
import EditIcon from "../../assets/svgs/edit.svg?react";
import TrashIcon from "../../assets/svgs/trash.svg?react";
import ColorsIcon from "../../assets/svgs/colors.svg?react";
import CheckIcon from "../../assets/svgs/checkCircle.svg?react";
import CloseIcon from "../../assets/svgs/closeCircle.svg?react";
import colors from "../../data/colors.json";
import Confirm from "../common/Confirm";
import { Button, Menu } from "react-aria-components";

interface Props {
  preset: any;
  savePreset: Signal<number>;
}

const renameRef = signal<number>(-1);
const newName = signal<string>("");
const add = signal<boolean>(false);
const newColor = signal<string>(
  colors[Math.floor(Math.random() * colors.length)],
);
const error = signal<string>("");
const confirmDelete = signal<any>(null);
const openConfirm = signal<boolean>(false);

export default function Tags({ preset, savePreset }: Props) {
  const tags = preset.value.attributes.tags.values;
  const refs = tags.map(() => useRef(undefined));

  const onRename = (tag: any, index: number) => {
    if (!newName.value) {
      error.value = "Tag name cannot be empty";
      return;
    }
    if (
      tags.some(
        (p: any) => p.name.toLowerCase() === newName.value.toLowerCase(),
      )
    ) {
      error.value = "Tag already exist";
      return;
    }
    if (newName.value.length >= 20) {
      error.value = "The tag name it's too long.";
      return;
    }
    const renamedTag = {
      ...tag,
      name: newName.value,
    };
    const newTagsValues = tags;
    newTagsValues.splice(index, 1, renamedTag);
    preset.value = {
      ...preset.value,
      attributes: {
        ...preset.value.attributes,
        tags: {
          active: preset.value.attributes.tags.active,
          values: newTagsValues,
        },
      },
    };
    error.value = "";
    newName.value = "";
    renameRef.value = -1;
    savePreset.value = preset.value.id;
  };

  const onAddTag = (e: any) => {
    e.preventDefault();
    const name = e.target.name.value;
    if (!name) {
      error.value = "Tag name cannot be empty";
      return;
    }
    if (tags.some((p: any) => p.name.toLowerCase() === name.toLowerCase())) {
      error.value = "Tag already exist";
      return;
    }
    if (tags.some((p: any) => p.color === newColor.value)) {
      error.value = "Color already used.";
      return;
    }
    if (name.length >= 20) {
      error.value = "The tag name it's too long.";
      return;
    }
    const newTags = tags;
    newTags.push({
      id: Date.now(),
      name,
      color: newColor.value,
    });
    preset.value = {
      ...preset.value,
      attributes: {
        ...preset.value.attributes,
        tags: {
          active: preset.value.attributes.tags.active,
          values: newTags,
        },
      },
    };
    error.value = "";
    savePreset.value = preset.value.id;
    add.value = false;
    newColor.value = colors[Math.floor(Math.random() * colors.length)];
  };

  const onChangeColor = (color: string, tag: any, index: number) => {
    if (!color) {
      error.value = "Please, select a valid color";
      return;
    }
    if (tags.some((p: any) => p.color === color)) {
      error.value = "Color already used.";
      return;
    }
    const newColor = {
      ...tag,
      color,
    };
    const newTags = tags;
    newTags.splice(index, 1, newColor);
    preset.value = {
      ...preset.value,
      attributes: {
        ...preset.value.attributes,
        tags: {
          active: preset.value.attributes.tags.active,
          values: newTags,
        },
      },
    };
    error.value = "";
    savePreset.value = preset.value.id;
  };

  const onDelete = (_tag: any, index: number) => {
    const newTags = tags;
    newTags.splice(index, 1);
    preset.value = {
      ...preset.value,
      attributes: {
        ...preset.value.attributes,
        tags: {
          active: preset.value.attributes.tags.active,
          values: newTags,
        },
      },
    };
    savePreset.value = preset.value.id;
    openConfirm.value = false;
    confirmDelete.value = null;
  };

  useEffect(() => {
    if (renameRef.value >= 0 && refs[renameRef.value]?.current) {
      refs[renameRef.value].current.focus();
      const range = document.createRange();
      range.selectNodeContents(refs[renameRef.value].current);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [renameRef.value]);

  return (
    <div className="relative text-center">
      <p className="pb-6 text-sm leading-3 antialiased">
        Tags are keywords or labels that help categorize tasks. They allow users
        to group related tasks together, making it easier to search and filter
        tasks.
      </p>
      {error.value && (
        <span className="text-center text-error">{error.value}</span>
      )}
      <div className="relative mb-6 flex flex-wrap items-center justify-center">
        {tags.map((t: any, i: number) => (
          <div
            key={t.id}
            className={`group m-1 flex items-center rounded-full px-4 py-0.5 bg-${t.color}-500 font-semibold text-white subpixel-antialiased outline-none`}
          >
            <span
              role="textbox"
              ref={refs[i]}
              contentEditable={renameRef.value === i ? "true" : "false"}
              className={`min-w-[30px] whitespace-nowrap outline-none ${
                renameRef.value === i && `bg-${t.color}-800`
              }`}
              onInput={(e: any) => (newName.value = e.target.textContent)}
              onKeyPress={(e) => e.key === "Enter" && onRename(t, i)}
            >
              {t.name}
            </span>
            {renameRef.value === i ? (
              <>
                <button className="z-20 ml-2" onClick={() => onRename(t, i)}>
                  <CheckIcon />
                </button>
                <button
                  className=""
                  onClick={() => {
                    renameRef.value = -1;
                    refs[i].current.textContent = tags[i].name;
                  }}
                >
                  <CloseIcon />
                </button>
              </>
            ) : (
              <div className="">
                <Menu>
                  <Button
                    className={`btn btn-square btn-ghost btn-xs ml-1 hidden group-hover:block ${
                      true ? "!block" : ""
                    }`}
                  >
                    <DotsIcon />
                  </Button>
                  {/* <Menu.Items className="menu menu-sm absolute -translate-x-24 translate-y-1 rounded-box bg-neutral">
                        <Menu.Item>
                          <li>
                            <button onClick={() => (renameRef.value = i)}>
                              <EditIcon className="h-4 w-4" /> Rename
                            </button>
                          </li>
                        </Menu.Item>
                        <Menu.Item>
                          <li>
                            <div>
                              <Menu>
                                <Menu.Button className="flex items-center whitespace-nowrap">
                                  <ColorsIcon className="mr-2 h-4 w-4" /> Change
                                  color
                                </Menu.Button>
                                <Menu.Items className="absolute z-50 w-[257px] -translate-x-36 -translate-y-32 rounded-box bg-neutral p-4">
                                  <h3 className="mb-2 text-center font-bold">
                                    COLOR
                                  </h3>
                                  {colors.map((color) => (
                                    <Menu.Item>
                                      <input
                                        name="color"
                                        type="button"
                                        className={`bg-${color}-500 mx-1 h-6 w-6 cursor-pointer rounded-full ring-primary hover:ring-4`}
                                        onClick={() =>
                                          onChangeColor(color, t, i)
                                        }
                                      />
                                    </Menu.Item>
                                  ))}
                                </Menu.Items>
                              </Menu>
                            </div>
                          </li>
                        </Menu.Item>
                        <Menu.Item>
                          <li>
                            <button
                              className="text-error"
                              onClick={() => {
                                confirmDelete.value = {
                                  type: 'delete',
                                  title: 'Delete Tag',
                                  element: t,
                                  index: i,
                                }
                                openConfirm.value = true
                              }}
                            >
                              <TrashIcon className="h-4 w-4" /> Delete
                            </button>
                          </li>
                        </Menu.Item>
                      </Menu.Items> */}
                </Menu>
              </div>
            )}
          </div>
        ))}
        {add.value ? (
          <form
            onSubmit={onAddTag}
            className={`group m-1 flex items-center rounded-full bg-base-100 px-2 py-0.5 font-semibold subpixel-antialiased outline-none`}
          >
            <Menu>
              <Button
                className={`mr-2 h-5 w-5 rounded-full ${
                  newColor.value && `bg-${newColor.value}-500`
                } `}
              ></Button>
              {/* <Menu.Items className="absolute z-50 w-[257px] -translate-x-20 -translate-y-24 rounded-box bg-neutral p-4">
                <h3 className="mb-2 text-center font-bold">COLOR</h3>
                {colors.map((color) => (
                  <Menu.Item>
                    <input
                      name="color"
                      type="button"
                      className={`bg-${color}-500 mx-1 h-6 w-6 cursor-pointer rounded-full ring-primary hover:ring-4`}
                      onClick={() => (newColor.value = color)}
                    />
                  </Menu.Item>
                ))}
              </Menu.Items> */}
            </Menu>
            <input
              name="name"
              type="text"
              className="bg-transparent outline-none"
            />
            <button type="submit" className="ml-2 text-primary">
              <CheckIcon />
            </button>
            <button className="text-error" onClick={() => (add.value = false)}>
              <CloseIcon />
            </button>
          </form>
        ) : (
          <button
            className="btn btn-ghost btn-sm m-1 rounded-full"
            onClick={() => (add.value = true)}
          >
            + Add Tag
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
