import { useEffect, useRef, useState } from "react";
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
  savePreset: number;
  setSavePreset: (value: number) => void;
}

export default function Tags({ preset, savePreset, setSavePreset }: Props) {
  const [renameRef, setRenameRef] = useState<number>(-1);
  const [newName, setNewName] = useState<string>("");
  const [add, setAdd] = useState<boolean>(false);
  const [newColor, setNewColor] = useState<string>(
    colors[Math.floor(Math.random() * colors.length)],
  );
  const [error, setError] = useState<string>("");
  const [confirmDelete, setConfirmDelete] = useState<any>(null);
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);

  const tags = preset.attributes.tags.values;
  const refs = tags.map(() => useRef(undefined));

  const onRename = (tag: any, index: number) => {
    if (!newName) {
      setError("Tag name cannot be empty");
      return;
    }
    if (tags.some((p: any) => p.name.toLowerCase() === newName.toLowerCase())) {
      setError("Tag already exist");
      return;
    }
    if (newName.length >= 20) {
      setError("The tag name it's too long.");
      return;
    }
    const renamedTag = {
      ...tag,
      name: newName,
    };
    const newTagsValues = [...tags];
    newTagsValues.splice(index, 1, renamedTag);
    preset.attributes.tags.values = newTagsValues;
    setError("");
    setNewName("");
    setRenameRef(-1);
    setSavePreset(preset.id);
  };

  const onAddTag = (e: any) => {
    e.preventDefault();
    const name = e.target.name.value;
    if (!name) {
      setError("Tag name cannot be empty");
      return;
    }
    if (tags.some((p: any) => p.name.toLowerCase() === name.toLowerCase())) {
      setError("Tag already exist");
      return;
    }
    if (tags.some((p: any) => p.color === newColor)) {
      setError("Color already used.");
      return;
    }
    if (name.length >= 20) {
      setError("The tag name it's too long.");
      return;
    }
    const newTags = [...tags];
    newTags.push({
      id: Date.now(),
      name,
      color: newColor,
    });
    preset.attributes.tags.values = newTags;
    setError("");
    setSavePreset(preset.id);
    setAdd(false);
    setNewColor(colors[Math.floor(Math.random() * colors.length)]);
  };

  const onChangeColor = (color: string, tag: any, index: number) => {
    if (!color) {
      setError("Please, select a valid color");
      return;
    }
    if (tags.some((p: any) => p.color === color)) {
      setError("Color already used.");
      return;
    }
    const newColorTag = {
      ...tag,
      color,
    };
    const newTags = [...tags];
    newTags.splice(index, 1, newColorTag);
    preset.attributes.tags.values = newTags;
    setError("");
    setSavePreset(preset.id);
  };

  const onDelete = (_tag: any, index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    preset.attributes.tags.values = newTags;
    setSavePreset(preset.id);
    setOpenConfirm(false);
    setConfirmDelete(null);
  };

  useEffect(() => {
    if (renameRef >= 0 && refs[renameRef]?.current) {
      refs[renameRef].current.focus();
      const range = document.createRange();
      range.selectNodeContents(refs[renameRef].current);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [renameRef]);

  return (
    <div className="relative text-center">
      <p className="pb-6 text-sm leading-3 antialiased">
        Tags are keywords or labels that help categorize tasks. They allow users
        to group related tasks together, making it easier to search and filter
        tasks.
      </p>
      {error && <span className="text-center text-error">{error}</span>}
      <div className="relative mb-6 flex flex-wrap items-center justify-center">
        {tags.map((t: any, i: number) => (
          <div
            key={t.id}
            className={`group m-1 flex items-center rounded-full px-4 py-0.5 bg-${t.color}-500 font-semibold text-white subpixel-antialiased outline-none`}
          >
            <span
              role="textbox"
              ref={refs[i]}
              contentEditable={renameRef === i ? "true" : "false"}
              className={`min-w-[30px] whitespace-nowrap outline-none ${
                renameRef === i && `bg-${t.color}-800`
              }`}
              onInput={(e: any) => setNewName(e.target.textContent)}
              onKeyPress={(e) => e.key === "Enter" && onRename(t, i)}
            >
              {t.name}
            </span>
            {renameRef === i ? (
              <>
                <button className="z-20 ml-2" onClick={() => onRename(t, i)}>
                  <CheckIcon />
                </button>
                <button
                  className=""
                  onClick={() => {
                    setRenameRef(-1);
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
                </Menu>
              </div>
            )}
          </div>
        ))}
        {add ? (
          <form
            onSubmit={onAddTag}
            className={`group m-1 flex items-center rounded-full bg-base-100 px-2 py-0.5 font-semibold subpixel-antialiased outline-none`}
          >
            <Menu>
              <Button
                className={`mr-2 h-5 w-5 rounded-full ${
                  newColor && `bg-${newColor}-500`
                } `}
              ></Button>
            </Menu>
            <input
              name="name"
              type="text"
              className="bg-transparent outline-none"
            />
            <button type="submit" className="ml-2 text-primary">
              <CheckIcon />
            </button>
            <button className="text-error" onClick={() => setAdd(false)}>
              <CloseIcon />
            </button>
          </form>
        ) : (
          <button
            className="btn btn-ghost btn-sm m-1 rounded-full"
            onClick={() => setAdd(true)}
          >
            + Add Tag
          </button>
        )}
      </div>
      <Confirm />
    </div>
  );
}
