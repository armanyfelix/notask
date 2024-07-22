import { Button, FieldError, Form, Input, TextArea, TextField } from 'react-aria-components'
import AddIconPopover from './AddIconPopover'
import supabase from '@/utils/supabase'
import { useContext } from 'react'
import { AlertContext } from '@/context/AlertContext'
import { Signal, signal } from '@preact/signals-react'

interface Props {
  accountId: number
  spaces: Signal<any>
  close: () => void
}

const icon = signal<any>(null)
// const preset = signal<any>(null)
const loading = signal<boolean>(false)
export default function CreateSpace({ accountId, spaces, close }: Props) {
  const notify = useContext(AlertContext)

  const onClose = () => {
    icon.value = null
    close
  }

  const onCreateSpace = async (e: any) => {
    e.preventDefault()
    loading.value = true
    let values: any = Object.fromEntries(new FormData(e.currentTarget))
    let iconPath = null

    if (icon.value) {
      const fileExt = icon.value.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`
      const { data, error } = await supabase.storage
        .from('spaces_icons')
        .upload(filePath, icon.value)
      if (error) {
        notify(
          'error',
          'The avatar could not be saved, please try again later.',
        )
      } else {
        iconPath = data.path
      }
    }

    const { data, error } = await supabase
      .from('spaces')
      .insert([
        {
          name: values.name.trim(),
          description: values.description,
          // color: color.value,
          image_url: iconPath,
          account: accountId,
        },
      ])
      .select()
      .single()

    if (error) {
      notify('error', 'Error creating the space, try again later')
    } else {
      notify('success', 'Space created')
      spaces.value?.push(data)
    }
    onClose()
    loading.value = false
  }

  return (
    <Form onSubmit={onCreateSpace} className="space-y-3">
      <div className="join w-full">
        <AddIconPopover icon={icon} />
        <TextField
          name="name"
          type="text"
          autoFocus
          isRequired
          minLength={3}
          maxLength={30}
          className="w-full"
        >
          <Input
            className="input join-item input-bordered border-l-0 invalid:border-error w-full bg-transparent font-semibold outline-none placeholder:text-base-content/50"
            placeholder="Name"
          />
          <FieldError className="text-error" />
        </TextField>
      </div>
      <TextField
        name="description"
        type="text"
        minLength={3}
        maxLength={1000}
        className="w-full"
      >
        <TextArea
          className="textarea textarea-bordered w-full bg-transparent placeholder:text-base-content/50"
          rows={2}
          placeholder="Description (optional)"
        ></TextArea>
      </TextField>
      <div className="card-actions justify-end">
        <Button
          type="submit"
          className="btn btn-primary text-xl"
          // disabled={!name.value}
          // onClick={() => onCreateSpace()}
        >
{loading.value ? (<span className="loading loading-dots loading-lg"></span>) : 'Create Space'}
        </Button>
      </div>
    </Form>
  )
}
