// import { Signal, signal } from '@preact/signals'
// import TableViewIcon from '../assets/svgs/tableView.svg?react'
// import KanbanViewIcon from '../assets/svgs/kanbanView.svg?react'
// import { Dialog } from '@headlessui/react'
// import EmojiSelector from './EmojiSelectorSimple'
// import supabase from '../utils/supabase'
// import { useContext } from 'preact/hooks'
// import { AlertContext } from '../context/AlertContext'
// import AttributesConfig from './ListConfig'
// import { ThemeState, useThemeStore } from '../utils/zustand'

// interface Props {
//   parent: Signal<any> | undefined
//   open: Signal<boolean>
//   account: any
//   setAccount: any
// }

// const name = signal<string>('')
// const icon = signal<string>('')
// const emojiCode = signal<string>('')
// const nameError = signal<string>('')
// const setting = signal<any>(null)
// const presets = signal<any>(null)
// const view = signal<string>('list')
// export default function CreateListDialog({
//   open,
//   parent,
//   account,
//   setAccount,
// }: Props) {
//   const notify = useContext(AlertContext)
//   const theme = useThemeStore((s: ThemeState) => s.theme)
//   const onCreateList = async () => {
//     if (!name.value) {
//       nameError.value = "The name it's required."
//       return
//     }
//     if (name.value.length >= 20) {
//       nameError.value = "The name it's too long."
//       return
//     }
//     const data: any = {
//       name: name.value,
//       icon: icon.value,
//       view: view.value,
//       settings: setting.value,
//       account: account.id,
//     }
//     if (parent?.value) {
//       switch (parent.value.type) {
//         case 'space':
//           data.space = parent.value.id
//           break
//         case 'folder':
//           data.folder = parent.value.id
//           break
//         default:
//           break
//       }
//     }
//     const res = await supabase.from('lists').insert([data]).select().single()
//     if (res.error) {
//       notify('error', 'The list could not be created, try again later.')
//     }
//     if (res.data) {
//       notify('success', `List ${res.data.name} created.`)
//       open.value = false
//     }
//   }

//   return (
//     <Dialog
//       data-theme={theme}
//       className="relative z-50"
//       open={open.value}
//       onClose={() => (open.value = false)}
//     >
//       <div
//         className="fixed inset-0 bg-base-100/10 backdrop-blur"
//         aria-hidden="true"
//       />
//       <div className="fixed inset-0 flex w-screen items-center justify-center">
//         <Dialog.Panel className="card card-compact rounded-box bg-base-300/50 p-2 shadow-xl backdrop-blur-lg">
//           <div className="card-body">
//             <Dialog.Title className="card-title text-2xl">
//               Create a new list
//             </Dialog.Title>
//             <div className="join z-50">
//               <EmojiSelector
//                 defaultIcon="list"
//                 emoji={icon}
//                 emojiCode={emojiCode}
//               />
//               <input
//                 className="input join-item w-full !outline-none"
//                 placeholder="Name"
//                 required
//                 value={name.value}
//                 onInput={(e: any) => (name.value = e.target.value)}
//               />
//             </div>
//             {nameError.value && (
//               <p className="text-center text-error">{nameError.value}</p>
//             )}
//             <div className="flex min-h-[3.75rem] items-center justify-between rounded-btn border p-4">
//               <h1 className="text-xl">Default View</h1>
//               <div className="flex items-center">
//                 <button
//                   className={`btn btn-sm mr-5 ${
//                     view.value === 'list' &&
//                     'text-secondary ring ring-secondary'
//                   }`}
//                   onClick={() => (view.value = 'list')}
//                 >
//                   <TableViewIcon />
//                   Table
//                 </button>
//                 <button
//                   className={`btn btn-sm ${
//                     view.value === 'kanban' &&
//                     'text-secondary ring ring-secondary'
//                   }`}
//                   onClick={() => (view.value = 'kanban')}
//                 >
//                   <KanbanViewIcon />
//                   Kanban
//                 </button>
//               </div>
//             </div>

//             <div className="collapse rounded-btn border border-neutral-content">
//               <input type="checkbox" defaultChecked />
//               <div className="collapse-title flex justify-between text-xl font-medium">
//                 <div>Settings</div>
//                 <div>{setting.value?.name || 'custom'}</div>
//               </div>
//               <div className="collapse-content">
//                 <AttributesConfig
//                   account={account}
//                   setAccount={setAccount}
//                   setting={setting}
//                   presets={presets}
//                 />
//               </div>
//             </div>
//             <div className="card-actions justify-end p-1">
//               <button className="btn btn-primary" onClick={() => onCreateList()}>
//                 Create List
//               </button>
//             </div>
//           </div>
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   )
// }
