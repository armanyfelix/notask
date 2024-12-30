import { signal } from '@preact/signals-react'
import { useContext, useEffect, useRef } from 'react'
import PlusIcon from '../../assets/svgs/plus.svg?react'
import DotsIcon from '../../assets/svgs/dotsBold.svg?react'
import CheckIcon from '../../assets/svgs/checkCircle.svg?react'
import CloseIcon from '../../assets/svgs/closeCircle.svg?react'
import supabase from '../../utils/supabase'
import { AlertContext } from '../../context/AlertContext'
// import Confirm from '../common/Confirm'
import defaultPreset from '../../data/default_list_setting.json'
import {
  Button,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from 'react-aria-components'
import Statuses from './Statuses'
import Dates from './Dates'

interface Props {
  config: any
  // setConfig: (config: any) => void
  account: any
  setAccount: any
}

const editPresetName = signal<number>(-1)
const newPresetName = signal<string>('')
const setNewPreset = signal<boolean>(false)
const editPresetError = signal<string>('')
const newPresetError = signal<string>('')
const openConfirm = signal<boolean>(false)
const savePreset = signal<string>('')
const confirmDeletePreset = signal<any>({
  title: '',
  element: '',
})
const presets = signal<any>([])
const statusesOpen = signal<boolean>(false)
const datesOpen = signal<boolean>(false)

export default function ListConfig({
  config,
  // setConfig,
  account,
  setAccount,
}: Props) {
  const notify = useContext(AlertContext)
  const presetRefs: any = [] // presets.value?.map(() => useRef())
  const newPresetRef = useRef<any>(null)

  const onRenamePreset = async (index: number) => {
    if (
      presets.value.some(
        (p: any) =>
          p.name.trim().toLowerCase() ===
          newPresetName.value.trim().toLowerCase(),
      )
    ) {
      editPresetError.value = 'Preset name already exists'
      return
    }
    if (newPresetName.value.length === 0) {
      editPresetError.value = 'Preset name cannot be empty'
      return
    }
    if (newPresetName.value.length >= 20) {
      editPresetError.value = "The Preset name it's too long."
      return
    }
    presets.value[index].name = newPresetName.value
    const { data, error } = await supabase
      .from('accounts')
      .update({ list_presets: presets.value })
      .eq('id', account.id)
      .select()
    if (error) {
      editPresetError.value = 'Error updating preset name, try again later'
    } else {
      editPresetError.value = ''
      notify('success', 'Preset name updated')
      setAccount(data[0])
    }
    editPresetName.value = -1
  }

  const onDeletePreset = async (_preset: any, index: number) => {
    const newPresets = presets.value
    newPresets.splice(index, 1)
    const { data, error }: any = await supabase
      .from('accounts')
      .update({ list_presets: newPresets })
      .eq('id', account.id)
      .select()
    if (error) {
      notify('error', 'Error deleting the preset, try again later')
    } else {
      notify('success', 'Preset deleted')
      setAccount(data[0])
      presets.value = data[0].list_presets
    }
    openConfirm.value = false
    confirmDeletePreset.value = null
  }

  const onAddPreset = async () => {
    if (
      presets.value.some(
        (p: any) =>
          p.name.trim().toLowerCase() ===
          newPresetName.value.trim().toLowerCase(),
      )
    ) {
      newPresetError.value = 'Preset name already exists'
      return
    }
    if (newPresetName.value.length === 0) {
      newPresetError.value = 'Preset name cannot be empty'
      return
    }
    if (newPresetName.value.length >= 20) {
      newPresetError.value = "The Preset name it's too long."
      return
    }
    const newPreset = {
      ...defaultPreset,
      id: Date.now(),
      name: newPresetName.value,
    }
    const newPresets = [...presets.value, newPreset]
    presets.value = newPresets
    setNewPreset.value = false
    const { data, error } = await supabase
      .from('accounts')
      .update({ list_presets: newPresets })
      .eq('id', account.id)
      .select()
      .single()
    if (error) {
      newPresetError.value = 'Error creating the preset, try again later'
    } else {
      newPresetError.value = ''
      notify('success', `Preset ${newPresetName.value} created`)
      presets.value = data.list_presets
      setAccount(data)
    }
    newPresetName.value = ''
  }

  const onUpdatePreset = async () => {
    const presetIndex = presets.value.findIndex(
      (p: any) => p.name === config.name,
    )
    const updatedPresets = presets.value
    updatedPresets.splice(presetIndex, 1, config)
    const { data, error } = await supabase
      .from('accounts')
      .update({ list_presets: updatedPresets })
      .eq('id', account.id)
      .select()

    if (error) {
      notify('error', 'Error updating the preset, try again later')
    } else {
      notify('success', 'Preset updated')
      presets.value = data[0].list_presets
      setAccount(data[0])
      // savePreset.value = -1
    }
  }

  useEffect(() => {
    if (setNewPreset.value && newPresetRef.current) {
      newPresetRef.current.focus()
    }
  }, [setNewPreset.value])

  useEffect(() => {
    if (editPresetName.value >= 0 && presetRefs[editPresetName.value].current) {
      presetRefs[editPresetName.value].current.focus()
      const range = document.createRange()
      range.selectNodeContents(presetRefs[editPresetName.value].current)
      const sel = window.getSelection()
      if (sel) {
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
  }, [editPresetName.value])

  useEffect(() => {
    if (account && account.list_presets) {
      presets.value = account.list_presets
    }
    // setConfig(defaultPreset)
    config.value = defaultPreset
  }, [])

  return (
    <div className="max-h-[60vh] overflow-y-auto">
      {config.value ? (
        <div>
          <div className="flex w-full justify-between">
            <div className="min-w-[200px] text-center">
              <ul className="menu">
                <li className="menu-title self-start">presets</li>
                <li>
                  <Button
                    className={`group flex-nowrap text-xl ${
                      config && config.name === 'Default' && 'active'
                    }`}
                    onPress={() => config.value = defaultPreset}
                  >
                    Default
                  </Button>
                </li>
                {presets.value &&
                  presets.value.map((p: any, i: number) => (
                    <Preset
                      config={config}
                      // setConfig={setConfig}
                      p={p}
                      i={i}
                      presetRefs={presetRefs}
                      onRenamePreset={onRenamePreset}
                      onUpdatePreset={onUpdatePreset}
                    />
                  ))}
                {setNewPreset.value ? (
                  <>
                    <li>
                      <div>
                        <input
                          type="text"
                          placeholder="Preset Name"
                          ref={newPresetRef}
                          className="w-24 bg-transparent text-lg outline-none"
                          onInput={(e: any) =>
                            (newPresetName.value = e.currentTarget.value)
                          }
                          onKeyUp={(e) => e.key === 'Enter' && onAddPreset()}
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
                            setNewPreset.value = false
                            newPresetName.value = ''
                          }}
                        >
                          <CloseIcon />
                        </button>
                      </div>
                    </li>
                    {newPresetError.value && (
                      <span className="pt- text-center text-xs font-semibold text-error">
                        {newPresetError.value}
                      </span>
                    )}
                  </>
                ) : (
                  <li>
                    <button
                      className="py-3"
                      onClick={() => (setNewPreset.value = true)}
                    >
                      <PlusIcon className="h-5 w-5" />
                      Add preset
                    </button>
                  </li>
                )}
              </ul>
            </div>
            <Configurations config={config} />
          </div>
        </div>
      ) : (
        ''
      )}
      {/* <Confirm
      data={confirmDeletePreset}
      open={openConfirm}
      handleConfirm={onDeletePreset}
      /> */}
    </div>
  )
}

const Preset = ({
  config,
  presets,
  p,
  i,
  presetRefs,
  onRenamePreset,
  onUpdatePreset,
}: any) => {
  return (
    <>
      {editPresetError.value && editPresetName.value === i && (
        <span className="pt-3 text-center font-semibold text-error">
          {editPresetError.value}
        </span>
      )}
      <li>
        <button
          className={`group flex w-full flex-nowrap items-center justify-between text-xl ${
            config.value?.name === p.name && 'active'
          } `}
          onClick={() => {
            // setConfig(p)
            config.value = p
            savePreset.value = ''
          }}
        >
          <span
            role="textbox"
            contentEditable={editPresetName.value === i ? 'true' : 'false'}
            ref={presetRefs[i]}
            className="w-full whitespace-nowrap outline-none"
            onInput={(e: any) => (newPresetName.value = e.target.textContent)}
          >
            {p.name}
          </span>
          {editPresetName.value === i ? (
            <>
              <button
                className="p-0.5 text-xs text-primary"
                onClick={() => onRenamePreset(i)}
                onKeyUp={(e) => e.key === 'Enter' && onRenamePreset(i)}
              >
                <CheckIcon />
              </button>
              <button
                className="p-0.5 text-xs text-error"
                onClick={() => {
                  editPresetName.value = -1
                  presetRefs[i].current.textContent = presets.value[i].name
                  newPresetName.value = ''
                  editPresetError.value = ''
                }}
              >
                <CloseIcon />
              </button>
            </>
          ) : savePreset.value === p.name ? (
            <button
              className="btn btn-accent btn-xs"
              onClick={(e: any) => {
                e.stopPropagation()
                onUpdatePreset()
              }}
            >
              save changes
            </button>
          ) : (
            <MenuTrigger>
              <Button
                onPress={(e: any) => e.stopPropagation()}
                className={`btn btn-square btn-ghost btn-xs group-hover:visible ${
                  true ? 'visible' : 'invisible'
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
                        onClick={() => (editPresetName.value = i)}
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
                          confirmDeletePreset.value = {
                            type: 'delete',
                            title: 'Delete Preset',
                            element: p,
                            index: i,
                          }
                          openConfirm.value = true
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
  )
}

const Configurations = ({ config }: any) => {
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
          className="input w-full !outline-none placeholder:opacity-50"
          value={config.value?.items_name || ''}
          onInput={(e: any) => {
            config.value = {
              ...config.value,
              items_name: e.target.value,
            }
            savePreset.value = config.value.name
          }}
        />
      </div>
      <h3 className="font-semibold opacity-40">Settings</h3>
      <div>
        <Button
          className={`btn no-animation mt-1 w-full items-center justify-between text-xl font-semibold ${
            statusesOpen.value && 'btn-active'
          }`}
          onPress={() => (statusesOpen.value = !statusesOpen.value)}
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
              className={`icon-[solar--alt-arrow-down-outline] ${statusesOpen.value && 'rotate-180 transform'}`}
            ></span>
          </div>
        </Button>
        {statusesOpen.value && (
          <Statuses
            // savePreset={savePreset}
            config={config}
          />
        )}
      </div>
      <div>
        <Button
          onPress={() => (datesOpen.value = !datesOpen.value)}
          className={`btn no-animation mt-1 w-full justify-between text-xl font-semibold ${
            datesOpen.value && 'btn-active'
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
              className={`icon-[solar--alt-arrow-down-outline] ${datesOpen.value && 'rotate-180 transform'}`}
            ></span>
          </div>
        </Button>
        {datesOpen.value && config.value && (
          <Dates
            savePreset={savePreset}
            config={config}
            // setConfig={setConfig}
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
  )
}
