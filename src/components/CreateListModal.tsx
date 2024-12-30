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
<<<<<<< HEAD
import AttributesConfig from './attributes/AttributesConfig'
=======
import ListConfig from './ListConfig'
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc

interface Props {
  parent: Signal<any>
  open: Signal<boolean>
  account: any
  setAccount: any
  getData: () => void
}

// const invalid = signal<boolean>(false)
<<<<<<< HEAD
const setting = signal<any>(null)
const presets = signal<any>(null)
const configOpen = signal<boolean>(false)
// const view = signal<string>('list')
=======
const configOpen = signal<boolean>(false)
const config = signal<any>(null)
// const view = signal<string>('list')

>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
export default function CreateListModal({
  open,
  parent,
  account,
  setAccount,
  getData,
}: Props) {
  const notify = useContext(AlertContext)
<<<<<<< HEAD
=======
  // const [config, setConfig] = useState<any>(null)
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc

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
<<<<<<< HEAD
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
=======
      <Dialog
        className={`dialog card min-w-96 ${configOpen.value && 'card-compact'}`}
      >
        <div className="card-body">
          <div className="flex items-center">
            {configOpen.value && (
              <Button
                onPress={() => (configOpen.value = false)}
                className="btn btn-square btn-ghost mr-4"
              >
                <span className="icon-[solar--arrow-left-outline] h-7 w-7"></span>
              </Button>
            )}
            <Heading slot="title" className="card-title mt-1 text-2xl">
              New list
            </Heading>
          </div>
          {configOpen.value ? (
            <>
              <ListConfig
                account={account}
                setAccount={setAccount}
                config={config}
                // setConfig={setConfig}
              />
            </>
          ) : (
            <Form
              onSubmit={onSubmit}
              // onInvalid={(e) => {
              //   e.preventDefault()
              //   invalid.value = true
              // }}
              className="form-control space-y-3"
            >
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
                  <span className="icon-[solar--clipboard-list-outline]"></span>
                  <Input className="grow" placeholder="Name" />
                </Label>
                <FieldError className="text-sm font-bold text-error" />
              </TextField>
              <Button
                onPress={() => (configOpen.value = true)}
                className="btn btn-outline justify-between text-lg font-medium"
              >
                <div>Settings</div>
                <div>{config.value?.name || 'custom'}</div>
              </Button>
              <div className="card-actions justify-end">
                <Button type="submit" className="btn btn-primary">
                  Create
                </Button>
              </div>
            </Form>
          )}
        </div>
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
      </Dialog>
    </Modal>
  )
}
