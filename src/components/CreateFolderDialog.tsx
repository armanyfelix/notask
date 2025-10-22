// import { Signal, signal } from '@preact/signals'
// import { Dialog } from '@headlessui/react'
// import EmojiSelector from './EmojiSelectorSimple'
// import supabase from '../utils/supabase'
// import { useContext } from 'preact/hooks'
// import { AlertContext } from '../context/AlertContext'

// interface Props {
//   parent: Signal<any>
//   open: Signal<boolean>
//   account: any
// }

// const name = signal<string>('')
// const icon = signal<string>('')
// const emojiCode = signal<string>('')
// const nameError = signal<string>('')
// export default function CreateFolderDialog({ open, parent, account }: Props) {
//   const notify = useContext(AlertContext)

//   const onCreateFolder = async () => {
//     // if (
//     //   folders.value.some(
//     //     (f: any) =>
//     //       f.name.trim().toLowerCase() ===
//     //       folders.value.trim().toLowerCase(),
//     //   )
//     // ) {
//     //   folder.value = 'Preset name already exists'
//     //   return
//     // }
//     if (name.value.length >= 20) {
//       nameError.value = "The name it's too long."
//       return
//     }

//     const data: any = {
//       name: name.value,
//       icon: icon.value,
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
//     const res = await supabase.from('folders').insert([data]).select().single()
//     if (res.error) {
//       notify('error', 'Error creating the folder, try again later.')
//     }
//     if (res.data) {
//       notify('success', 'Folder created.')
//       open.value = false
//     }
//   }

//   return (
//     <Dialog
//       className="relative z-50"
//       open={open.value}
//       onClose={() => (open.value = false)}
//     >
//       <div
//         className="fixed inset-0 bg-gradient-to-t from-base-100 to-base-100/10 backdrop-opacity-20"
//         aria-hidden="true"
//       />
//       <div className="fixed inset-0 flex w-screen items-center justify-center">
//         <Dialog.Panel className="card rounded-box bg-base-300/50 p-2 shadow-xl backdrop-blur-lg">
//           <div className="card-body">
//             <Dialog.Title className="card-title text-2xl">
//               New Folder
//             </Dialog.Title>
//             <div className="join z-50 m-1 py-5">
//               <EmojiSelector
//                 defaultIcon="folder"
//                 emoji={icon}
//                 emojiCode={emojiCode}
//               />
//               <input
//                 className="input join-item w-full !outline-none"
//                 placeholder="Name"
//                 required
//                 value={name.value}
//                 onInput={(e: any) => (name.value = e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && onCreateFolder()}
//               />
//             </div>
//             {nameError.value && (
//               <p className="text-center text-error">{nameError.value}</p>
//             )}

//             <div className="card-actions justify-end p-1">
//               <button className="btn btn-primary" onClick={() => onCreateFolder()}>
//                 Create Folder
//               </button>
//             </div>
//           </div>
//         </Dialog.Panel>
//       </div>
//     </Dialog>
//   )
// }
