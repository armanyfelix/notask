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

interface Props {
  parent: Signal<any>
  open: Signal<boolean>
  account: any
  getData: () => void
}

const invalid = signal<boolean>(false)
export default function CreateFolderModal({ open, parent, account, getData }: Props) {
  const notify = useContext(AlertContext)

  const onSubmit = async (e: any) => {
    e.preventDefault()
    invalid.value = false
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
      .from('folders')
      .insert([values])
      .select()
      .single()
    if (error) {
      notify('error', 'Error creating the folder, try again later.')
    }
    if (data) {
      notify('success', 'Folder created.')
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
      <Dialog className="card w-96 dialog">
        <Form
          onSubmit={onSubmit}
          onInvalid={(e) => {
            e.preventDefault()
            invalid.value = true
          }}
          className="card-body"
        >
          <Heading slot="title" className="card-title">
            New folder
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
              className={`input flex bg-transparent input-bordered items-center gap-3 ${invalid.value ? 'input-error' : 'input-bordered'}`}
            >
              <span className="icon-[solar--folder-2-linear]"></span>
              <Input className="grow placeholder:text-base-content/50" placeholder="Name" />
            </Label>
            <FieldError className="text-sm font-bold text-error" />
          </TextField>
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
