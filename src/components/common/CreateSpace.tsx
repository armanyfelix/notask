import {
  Button,
  FieldError,
  Form,
  Input,
  TextArea,
  TextField,
} from 'react-aria-components'
import supabase from '@/utils/supabase'
import { Suspense, useContext } from 'react'
import { AlertContext } from '@/context/AlertContext'
import { Signal, signal } from '@preact/signals-react'
import IconSelectorPopover from './IconSelectorPopover'

interface Props {
  accountId: number
  spaces: Signal<any>
  onClose: () => void
}

const icon = signal<any>({
  image: '',
  name: '',
  color: '',
})
const loading = signal<boolean>(false)
export default function CreateSpace({ accountId, spaces, onClose }: Props) {
  const notify = useContext(AlertContext)

  const onCreateSpace = async (e: any) => {
    e.preventDefault()
    loading.value = true
    let values: any = Object.fromEntries(new FormData(e.currentTarget))

    console.log('icon.value :>> ', icon.value);
    if (icon.value.image) {
      const fileExt = icon.value.image.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`
      const { data, error } = await supabase.storage
        .from('spaces_icons')
        .upload(filePath, icon.value.image)
      if (error) {
        notify(
          'error',
          'The avatar could not be saved, please try again later.',
        )
      } else {
        values = {
          ...values,
          image: data.path,
        }
      }
    }
    if (icon.value.name) {
      values = {
        ...values,
        icon: {
          name: icon.value.name,
          color: icon.value.color,
        },
      }
    }
    const { data, error } = await supabase
      .from('spaces')
      .insert([
        {
          ...values,
          name: values.name.trim(),
          description: values.description,
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
    loading.value = false
    onClose()
    icon.value = {
      image: '',
      name: '',
      color: '',
    }
  }

  return (
    <Form onSubmit={onCreateSpace} className="space-y-3">
      <div className="join w-full">
        <Suspense fallback="">
          <IconSelectorPopover selectedIcon={icon} />
        </Suspense>
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
            className="input join-item input-bordered w-full border-l-0 bg-transparent font-semibold outline-none placeholder:text-base-content/50 invalid:border-error"
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
          {loading.value ? (
            <span className="loading loading-dots loading-md"></span>
          ) : (
            'Create Space'
          )}
        </Button>
      </div>
    </Form>
  )
}
