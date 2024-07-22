import { Signal, signal } from '@preact/signals-react'
import supabase from '../utils/supabase'
import { useContext } from 'react'
import { AlertContext } from '../context/AlertContext'
import {
  Button,
  Dialog,
  FieldError,
  Form,
  Heading,
  Input,
  Label,
  Modal,
  TextField,
} from 'react-aria-components'
import AttributesConfig from './attributes/AttributesConfig'

interface Props {
  parent: Signal<any>
  open: Signal<boolean>
  account: any
  setAccount: any
  getData: () => void
}

// const invalid = signal<boolean>(false)
const setting = signal<any>(null)
const presets = signal<any>(null)
const configOpen = signal<boolean>(false)
// const view = signal<string>('list')
export default function CreateListModal({
  open,
  parent,
  account,
  setAccount,
  getData,
}: Props) {
  const notify = useContext(AlertContext)

  const onSubmit = async (e: any) => {
    e.preventDefault()
    // invalid.value = false
    let values = Object.fromEntries(new FormData(e.currentTarget))
    values.account = account.id
    if (parent?.value) {
      switch (parent.value.type) {
        case 'space':
          values.space = parent.value.id
          break
        case 'folder':
          values.folder = parent.value.id
          break
        default:
          break
      }
    }
    const { error, data } = await supabase
      .from('lists')
      .insert([values])
      .select()
      .single()
    if (error) {
      notify('error', 'Error creating the list, try again later.')
    }
    if (data) {
      notify('success', 'List created.')
      getData()
      open.value = false
    }
  }

  return (
    <Modal
      isDismissable
      isOpen={open.value}
      onOpenChange={() => (open.value = false)}
    >
      <Dialog className="dialog card w-96">
        <Form
          onSubmit={onSubmit}
          // onInvalid={(e) => {
          //   e.preventDefault()
          //   invalid.value = true
          // }}
          className="card-body"
        >
          <Heading slot="title" className="card-title">
            New list
          </Heading>
          <TextField
            name="name"
            type="text"
            autoFocus
            isRequired
            minLength={3}
            maxLength={30}
          >
            <Label
              className={`input input-bordered flex items-center gap-3 has-[:invalid]:input-error`}
            >
              <span className="icon-[solar--folder-2-linear]"></span>
              <Input className="grow" placeholder="Name" />
            </Label>
            <FieldError className="text-sm font-bold text-error" />
          </TextField>
          <Button
            onPress={() => (configOpen.value = true)}
            className="btn btn-outline justify-between text-lg font-medium"
          >
            <div>Settings</div>
            <div>{setting.value?.name || 'custom'}</div>
            <AttributesConfig
              account={account}
              setAccount={setAccount}
              setting={setting}
              presets={presets}
            />
          </Button>
          <div className="card-actions justify-end">
            <Button type="submit" className="btn btn-primary">
              Create
            </Button>
          </div>
        </Form>
      </Dialog>
    </Modal>
  )
}
