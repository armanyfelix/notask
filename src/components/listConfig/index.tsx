import { useContext, useEffect, useRef, useState } from "react";
import PlusIcon from "../../assets/svgs/plus.svg?react";
import DotsIcon from "../../assets/svgs/dotsBold.svg?react";
import CheckIcon from "../../assets/svgs/checkCircle.svg?react";
import CloseIcon from "../../assets/svgs/closeCircle.svg?react";
import supabase from "../../utils/supabase";
import { AlertContext } from "../../context/AlertContext";
// import Confirm from '../common/Confirm'
import defaultPreset from "../../data/default_list_setting.json";
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from "react-aria-components";
import Statuses from "./Statuses";
import Dates from "./Dates";

interface Props {
  config: any;
  setConfig: (config: any) => void;
  account: any;
  setAccount: any;
}

export default function ListConfig({
  config,
  setConfig,
  account,
  setAccount,
}: Props) {
  const notify = useContext(AlertContext);
  const presetRefs: any = []; // presets.value?.map(() => useRef())
  const newPresetRef = useRef<any>(null);

  const [editPresetName, setEditPresetName] = useState<number>(-1);
  const [newPresetName, setNewPresetName] = useState<string>("");
  const [setNewPreset, setSetNewPreset] = useState<boolean>(false);
  const [editPresetError, setEditPresetError] = useState<string>("");
  const [newPresetError, setNewPresetError] = useState<string>("");
  const [openConfirm, setOpenConfirm] = useState<boolean>(false);
  const [savePreset, setSavePreset] = useState<string>("");
  const [confirmDeletePreset, setConfirmDeletePreset] = useState<any>({
    title: "",
    element: "",
  });
  const [presets, setPresets] = useState<any>([]);
  const [statusesOpen, setStatusesOpen] = useState<boolean>(false);
  const [datesOpen, setDatesOpen] = useState<boolean>(false);

  const onRenamePreset = async (index: number) => {
    if (
      presets.some(
        (p: any) =>
          p.name.trim().toLowerCase() === newPresetName.trim().toLowerCase(),
      )
    ) {
      setEditPresetError("Preset name already exists");
      return;
    }
    if (newPresetName.length === 0) {
      setEditPresetError("Preset name cannot be empty");
      return;
    }
    if (newPresetName.length >= 20) {
      setEditPresetError("The Preset name it's too long.");
      return;
    }
    const updatedPresets = [...presets];
    updatedPresets[index].name = newPresetName;
    setPresets(updatedPresets);
    const { data, error } = await supabase
      .from("accounts")
      .update({ list_presets: presets })
      .eq("id", account.id)
      .select();
    if (error) {
      setEditPresetError("Error updating preset name, try again later");
    } else {
      setEditPresetError("");
      notify("success", "Preset name updated");
      setAccount(data[0]);
    }
    setEditPresetName(-1);
  };

  const onDeletePreset = async (_preset: any, index: number) => {
    const newPresets = presets;
    newPresets.splice(index, 1);
    const { data, error }: any = await supabase
      .from("accounts")
      .update({ list_presets: newPresets })
      .eq("id", account.id)
      .select();
    if (error) {
      notify("error", "Error deleting the preset, try again later");
    } else {
      notify("success", "Preset deleted");
      setAccount(data[0]);
      setPresets(data[0].list_presets);
    }
    setOpenConfirm(false);
    setConfirmDeletePreset(null);
  };

  const onAddPreset = async () => {
    if (
      presets.some(
        (p: any) =>
          p.name.trim().toLowerCase() === newPresetName.trim().toLowerCase(),
      )
    ) {
      setNewPresetError("Preset name already exists");
      return;
    }
    if (newPresetName.length === 0) {
      setNewPresetError("Preset name cannot be empty");
      return;
    }
    if (newPresetName.length >= 20) {
      setNewPresetError("The Preset name it's too long.");
      return;
    }
    const newPreset = {
      ...defaultPreset,
      id: Date.now(),
      name: newPresetName,
    };
    const newPresets = [...presets, newPreset];
    setPresets(newPresets);
    setSetNewPreset(false);
    const { data, error } = await supabase
      .from("accounts")
      .update({ list_presets: newPresets })
      .eq("id", account.id)
      .select()
      .single();
    if (error) {
      setNewPresetError("Error creating the preset, try again later");
    } else {
      setNewPresetError("");
      notify("success", `Preset ${newPresetName} created`);
      setPresets(data.list_presets);
      setAccount(data);
    }
    setNewPresetError("");
  };

  const onUpdatePreset = async () => {
    const presetIndex = presets.findIndex((p: any) => p.name === config.name);
    const updatedPresets = presets;
    updatedPresets.splice(presetIndex, 1, config);
    const { data, error } = await supabase
      .from("accounts")
      .update({ list_presets: updatedPresets })
      .eq("id", account.id)
      .select();

    if (error) {
      notify("error", "Error updating the preset, try again later");
    } else {
      notify("success", "Preset updated");
      setPresets(data[0].list_presets);
      setAccount(data[0]);
      // savePreset.value = -1
    }
  };

  useEffect(() => {
    if (setNewPreset && newPresetRef.current) {
      newPresetRef.current.focus();
    }
  }, [setNewPreset]);

  useEffect(() => {
    if (editPresetName >= 0 && presetRefs[editPresetName].current) {
      presetRefs[editPresetName].current.focus();
      const range = document.createRange();
      range.selectNodeContents(presetRefs[editPresetName].current);
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }, [editPresetName]);

  useEffect(() => {
    if (account && account.list_presets) {
      setPresets(account.list_presets);
    }
    setConfig(defaultPreset);
  }, []);

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      {config ? (
        <div>
          <div className="flex w-full justify-between">
            <div className="min-w-[200px] text-center">
              <ul className="menu">
                <li className="menu-title self-start">presets</li>
                <li>
                  <Button
                    className={`group flex-nowrap text-xl ${
                      config && config.name === "Default" && "active"
                    }`}
                    onPress={() => setConfig(defaultPreset)}
                  >
                    Default
                  </Button>
                </li>
                {presets.value &&
                  presets.value.map((p: any, i: number) => (
                    <Preset
                      config={config}
                      setConfig={setConfig}
                      presets={presets}
                      p={p}
                      i={i}
                      presetRefs={presetRefs}
                      onRenamePreset={onRenamePreset}
                      onUpdatePreset={onUpdatePreset}
                      editPresetError={editPresetError}
                      editPresetName={editPresetName}
                      setSavePreset={setSavePreset}
                      setNewPresetName={setNewPresetName}
                      newPresetName={newPresetName}
                      setEditPresetName={setEditPresetName}
                      setEditPresetError={setEditPresetError}
                      savePreset={savePreset}
                      setConfirmDeletePreset={setConfirmDeletePreset}
                      setOpenConfirm={setOpenConfirm}
                    />
                  ))}
                {setNewPreset ? (
                  <>
                    <li>
                      <div>
                        <input
                          type="text"
                          placeholder="Preset Name"
                          ref={newPresetRef}
                          className="w-24 bg-transparent text-lg outline-none"
                          onInput={(e: any) =>
                            setNewPresetName(e.currentTarget.value)
                          }
                          onKeyUp={(e) => e.key === "Enter" && onAddPreset()}
                        />
                        <button
                          className="text-xs text-primary"
                          onClick={onAddPreset}
                        >
                          <CheckIcon />
                        </button>
                        <button
                          className="text-xs text-error"
                          onClick={() => {
                            setSetNewPreset(false);
                            setNewPresetName("");
                          }}
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    </li>
                    {newPresetError && (
                      <span className="pt- text-center text-xs font-semibold text-error">
                        {newPresetError}
                      </span>
                    )}
                  </>
                ) : (
                  <li>
                    <button
                      className="py-3"
                      onClick={() => setSetNewPreset(true)}
                    >
                      <PlusIcon className="h-5 w-5" />
                      Add preset
                    </button>
                  </li>
                )}
              </ul>
            </div>
            <Configurations
              config={config}
              setConfig={setConfig}
              setSavePreset={setSavePreset}
              statusesOpen={statusesOpen}
              setStatusesOpen={setStatusesOpen}
              setDatesOpen={setDatesOpen}
              datesOpen={datesOpen}
            />
          </div>
        </div>
      ) : (
        ""
      )}
      {/* <Confirm
      data={confirmDeletePreset}
      open={openConfirm}
      handleConfirm={onDeletePreset}
      /> */}
    </div>
  );
}

const Preset = ({
  config,
  setConfig,
  presets,
  p,
  i,
  presetRefs,
  onRenamePreset,
  onUpdatePreset,
  editPresetError,
  editPresetName,
  setSavePreset,
  setNewPresetName,
  newPresetName,
  setEditPresetName,
  setEditPresetError,
  savePreset,
  setConfirmDeletePreset,
  setOpenConfirm,
}: any) => {
  return (
    <>
      {editPresetError && editPresetName === i && (
        <span className="pt-3 text-center font-semibold text-error">
          {editPresetError}
        </span>
      )}
      <li>
        <button
          className={`group flex w-full flex-nowrap items-center justify-between text-xl ${
            config?.name === p.name && "active"
          } `}
          onClick={() => {
            setConfig(p);
            setSavePreset("");
          }}
        >
          <span
            role="textbox"
            contentEditable={editPresetName === i ? "true" : "false"}
            ref={presetRefs[i]}
            className="w-full whitespace-nowrap outline-none"
            onInput={(e: any) => setNewPresetName(e.target.textContent)}
          >
            {p.name}
          </span>
          {editPresetName === i ? (
            <>
              <button
                className="p-0.5 text-xs text-primary"
                onClick={() => onRenamePreset(i)}
                onKeyUp={(e) => e.key === "Enter" && onRenamePreset(i)}
              >
                <CheckIcon />
              </button>
              <button
                className="p-0.5 text-xs text-error"
                onClick={() => {
                  setEditPresetName(-1);
                  presetRefs[i].current.textContent = presets[i].name;
                  setNewPresetName("");
                  setEditPresetError("");
                }}
              >
                <CloseIcon />
              </button>
            </>
          ) : savePreset === p.name ? (
            <button
              className="btn btn-accent btn-xs"
              onClick={(e: any) => {
                e.stopPropagation();
                onUpdatePreset();
              }}
            >
              save changes
            </button>
          ) : (
            <MenuTrigger>
              <Button
                onPress={(e: any) => e.stopPropagation()}
                className={`btn btn-square btn-ghost btn-xs group-hover:visible ${
                  true ? "visible" : "invisible"
                }`}
              >
                <DotsIcon className="h-5 w-5" />
              </Button>
              <Popover>
                <Menu className="menu menu-xs rounded-box bg-base-300">
                  <MenuItem>
                    <li>
                      <button
                        className="whitespace-nowrap"
                        onClick={() => setEditPresetName(i)}
                      >
                        {/* <EditIcon className="h-5 w-5" /> */}
                        Edit name
                      </button>
                    </li>
                  </MenuItem>
                  <MenuItem>
                    <li>
                      <button
                        className="text-error"
                        onClick={() => {
                          setConfirmDeletePreset({
                            type: "delete",
                            title: "Delete Preset",
                            element: p,
                            index: i,
                          });
                          setOpenConfirm(true);
                        }}
                      >
                        {/* <TrashIcon className="h-5 w-5" /> */}
                        Delete
                      </button>
                    </li>
                  </MenuItem>
                </Menu>
              </Popover>
            </MenuTrigger>
          )}
        </button>
      </li>
    </>
  );
};

const Configurations = ({
  config,
  setConfig,
  setSavePreset,
  statusesOpen,
  setStatusesOpen,
  setDatesOpen,
  datesOpen,
}: any) => {
  // const options: any = [
  //   {
  //     name: 'Schedule',
  //   }
  // ]
  return (
    <div className="flex w-[500px] flex-col p-2">
      <div className="mb-5">
        <label className="label">
          <span className="label-text font-semibold opacity-40">
            Items name:
          </span>
        </label>
        <input
          type="text"
          placeholder="ex. task, post, client, contact, income..."
          className="input w-full outline-none! placeholder:opacity-50"
          value={config?.items_name || ""}
          onInput={(e: any) => {
            setConfig({
              ...config,
              items_name: e.target.value,
            });
            setSavePreset(config.name);
          }}
        />
      </div>
      <h3 className="font-semibold opacity-40">Settings</h3>
      <div>
        <Button
          className={`btn no-animation mt-1 w-full items-center justify-between text-xl font-semibold ${
            statusesOpen && "btn-active"
          }`}
          onPress={() => setStatusesOpen(!statusesOpen)}
        >
          <div className="flex items-center">
            <span className="icon-[solar--check-square-broken] mr-3 h-7 w-7"></span>
            Statuses
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="toggle toggle-primary mr-2"
              // checked={preset.value?.statuses.active}
              // onClick={(e: any) => {
              //   e.stopPropagation()
              //   const attributes = preset.value?.attributes
              //   preset.value = {
              //     ...preset.value,
              //     attributes: {
              //       ...attributes,
              //       statuses: {
              //         active: !attributes.statuses.active,
              //         values: attributes.statuses.values,
              //       },
              //     },
              //   }
              //   savePreset.value = preset.value.id
              // }}
            />
            <span
              className={`icon-[solar--alt-arrow-down-outline] ${statusesOpen && "rotate-180 transform"}`}
            ></span>
          </div>
        </Button>
        {statusesOpen && (
          <Statuses
            // savePreset={savePreset}
            config={config}
          />
        )}
      </div>
      <div>
        <Button
          onPress={() => setDatesOpen(!datesOpen)}
          className={`btn no-animation mt-1 w-full justify-between text-xl font-semibold ${
            datesOpen && "btn-active"
          }`}
        >
          <div className="flex items-center">
            <span className="icon-[solar--calendar-date-broken] mr-3 h-7 w-7"></span>
            Schedules
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="toggle toggle-primary mr-2"
              // checked={preset.value?.attributes?.dates.active}
              // onClick={(e: any) => {
              //   e.stopPropagation()
              //   const attributes = preset.value?.attributes
              //   preset.value = {
              //     ...preset.value,
              //     attributes: {
              //       ...attributes,
              //       dates: {
              //         active: !attributes.dates.active,
              //         values: attributes.dates.values,
              //       },
              //     },
              //   }
              //   savePreset.value = preset.value.id
              // }}
            />
            <span
              className={`icon-[solar--alt-arrow-down-outline] ${datesOpen && "rotate-180 transform"}`}
            ></span>
          </div>
        </Button>
        {datesOpen && config && (
          <Dates
            // savePreset={savePreset}
            config={config}
            setConfig={setConfig}
            setSavePreset={setSavePreset}
          />
        )}
      </div>
      {/* <div>
        <Button
          className={`btn no-animation mt-1 w-full justify-between text-xl font-semibold ${
            true && 'btn-active'
          }`}
        >
          <div className="flex items-center">
            <PriorityIcon className="mr-2 h-7 w-7" />
            Priority
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="toggle toggle-primary mr-2"
              checked={preset.value?.attributes?.priority.active}
              onClick={(e: any) => {
                e.stopPropagation()
                const attributes = preset.value?.attributes
                preset.value = {
                  ...preset.value,
                  attributes: {
                    ...attributes,
                    priority: {
                      active: !attributes.priority.active,
                      values: attributes.priority.values,
                    },
                  },
                }
                savePreset.value = preset.value?.id
              }}
            />
            <ChevronLeftIcon className={`${true && '-rotate-90 transform'}`} />
          </div>
        </Button>
      </div>
      <div>
        <Button
          className={`btn no-animation mt-1 w-full justify-between text-xl font-semibold ${
            true && 'btn-active'
          }`}
        >
          <div className="flex items-center">
            <TagsIcon className="mr-2 h-7 w-7" />
            Tags
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="toggle toggle-primary mr-2"
              checked={preset.value?.attributes?.tags.active}
              onClick={(e: any) => {
                e.stopPropagation()
                const attributes = preset.value?.attributes
                preset.value = {
                  ...preset.value,
                  attributes: {
                    ...attributes,
                    tags: {
                      active: !attributes.tags.active,
                      values: attributes.tags.values,
                    },
                  },
                }
                savePreset.value = preset.value.id
              }}
            />
            <ChevronLeftIcon className={`${true && '-rotate-90 transform'}`} />
          </div>
        </Button>
      </div>
      <div>
        <Button
          className={`btn no-animation mt-1 w-full justify-between text-xl font-semibold ${
            true && 'btn-active'
          }`}
        >
          <div className="flex items-center">
            <FieldsIcon className="mr-2 h-7 w-7" />
            Fields
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="toggle toggle-primary mr-2"
              checked={preset.value?.attributes?.fields.active}
              onClick={(e: any) => {
                e.stopPropagation()
                const attributes = preset.value?.attributes
                preset.value = {
                  ...preset.value,
                  attributes: {
                    ...attributes,
                    fields: {
                      active: !attributes.fields.active,
                      values: attributes.fields.values,
                    },
                  },
                }
                savePreset.value = preset.value.id
              }}
            />
            <ChevronLeftIcon
              className={`${true && '-rotate-90 transform'} z-0`}
            />
          </div>
        </Button>
      </div>
      <div>
        <Button
          className={`btn no-animation mt-1 w-full justify-between text-xl font-semibold ${
            true && 'btn-active'
          }`}
        >
          <div className="flex items-center">
            <TimerIcon className="mr-2 h-7 w-7" />
            Timer
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="toggle toggle-primary mr-2"
              checked={preset.value?.attributes?.timer?.active}
              onClick={(e: any) => {
                e.stopPropagation()
                preset.value = {
                  ...preset.value,
                  attributes: {
                    ...preset.value.attributes,
                    timer: {
                      active: !preset.value.attributes.timer.active,
                      values: preset.value.attributes.timer.values,
                    },
                  },
                }
                savePreset.value = preset.value.id
              }}
            />
            <ChevronLeftIcon className={`${true && '-rotate-90 transform'}`} />
          </div>
        </Button>
      </div>
      <div>
        <Button
          className={`btn no-animation mt-1 w-full justify-between text-xl font-semibold ${
            true && 'btn-active'
          }`}
        >
          <span className="flex items-center">
            <RelationshipsIcon className="mr-2 h-7 w-7" />
            Relationships
          </span>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="toggle toggle-primary mr-2"
              checked={preset.value?.attributes?.relationships.active}
              onClick={(e: any) => {
                e.stopPropagation()
                const attributes = preset.value?.attributes
                preset.value = {
                  ...preset.value,
                  attributes: {
                    ...attributes,
                    relationships: {
                      active: !attributes.relationships.active,
                      values: attributes.relationships.values,
                    },
                  },
                }
                savePreset.value = preset.value.id
              }}
            />
            <ChevronLeftIcon className={`${true && '-rotate-90 transform'}`} />
          </div>
        </Button>
      </div>
      <div>
        <Button
          className={`btn no-animation mt-1 w-full justify-between text-xl font-semibold ${
            true && 'btn-active'
          }`}
        >
          <div className="flex items-center">
            <CollaborationIcon className="mr-2 h-7 w-7" />
            Collaboration
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="toggle toggle-primary mr-2"
              checked={preset.value?.attributes?.collaboration.active}
              onClick={(e: any) => {
                e.stopPropagation()
                const attributes = preset.value?.attributes
                preset.value = {
                  ...preset.value,
                  attributes: {
                    ...attributes,
                    collaboration: {
                      active: !attributes.collaboration.active,
                      values: attributes.collaboration.values,
                    },
                  },
                }
                savePreset.value = preset.value.id
              }}
            />
            <ChevronLeftIcon className={`${true && '-rotate-90 transform'}`} />
          </div>
        </Button>
      </div> */}
    </div>
  );
};
