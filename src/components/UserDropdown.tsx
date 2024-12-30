import supabase from '../utils/supabase'
<<<<<<< HEAD
import {
  Button,
  Dialog,
  DialogTrigger,
=======
import { fetch } from '@tauri-apps/plugin-http';
import {
  Button,
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
  Header,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  SubmenuTrigger,
  Text,
} from 'react-aria-components'
<<<<<<< HEAD
import UserIcon from '../assets/svgs/user.svg?react'
=======
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
import themes from '../data/themes.json'
import { useEffect } from 'react'
import {
  AccountState,
  ThemeState,
  useAccountStore,
  useThemeStore,
} from '../utils/zustand'
import { signal } from '@preact/signals-react'
import { Link } from 'react-router-dom'

interface Props {
  session: any
}

const avatarUrl = signal<string>('')
export default function UserDropdown({}: Props) {
  const { account } = useAccountStore((s: AccountState) => s)
  const { theme, setTheme } = useThemeStore((s: ThemeState) => s)
  async function downloadImage(path: string) {
<<<<<<< HEAD
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path)
=======
    // try {
    //   const response = await fetch('http://test.tauri.app/data.json', {
    //     method: 'GET',
    //   });
    //   console.log(response.status); // e.g. 200
    //   console.log(response.statusText); // e.g. "OK"
    // console.log('kocskadcoksm')
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path)
      // console.log('data :>> ', data);
      // console.log('error :>> ', error);
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      avatarUrl.value = url
<<<<<<< HEAD
    } catch (error: any) {
      console.log('Error downloading image: ', error.message)
    }
=======
    // } catch (error: any) {
    //   console.log('Error downloading image: ', error.message)
    // }
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
  }

  const onSignOut = () => {
    supabase.auth.signOut()
  }

  useEffect(() => {
<<<<<<< HEAD
    if (account?.avatar_url) {
=======

    if (account?.avatar_url) {
      console.log('account.avatar_url :>> ', account.avatar_url);
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
      downloadImage(account.avatar_url)
    }
  }, [])

  return (
    <MenuTrigger>
<<<<<<< HEAD
      <Button className="rounded-full outline-none">
        {avatarUrl.value ? (
          <img
            src={avatarUrl.value}
            className="h-8 w-8 rounded-full"
            alt="avatar"
          />
        ) : (
          <UserIcon className="h-8 w-8" />
        )}
      </Button>
      <Popover placement='right bottom'>
=======
      <Button className="btn btn-ghost btn-circle avatar">
        {avatarUrl.value ? (
          <img
            src={avatarUrl.value}
            className="h-5 w-5 rounded-full"
            alt="avatar"
          />
        ) : (
          <span className="icon-[solar--user-circle-bold-duotone] h-10 w-10"></span>
        )}
      </Button>
      <Popover placement="bottom">
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc
        <Menu className="dialog menu flex-nowrap">
          <MenuItem>
            <li>
              <Header className="menu-title grid">
                <Text slot="label">{account?.name || ''}</Text>
                <Text slot="description" className="font-normal">
                  {account?.email || ''}
                </Text>
              </Header>
            </li>
          </MenuItem>
          <MenuItem>
            <li>
              <Link to="/settings" className="">
                Settings
              </Link>
            </li>
          </MenuItem>
          <SubmenuTrigger>
            <MenuItem>
              <li className="group">
                <Button>
                  <span className="icon-[solar--alt-arrow-left-linear] hidden group-hover:block"></span>
                  {themes.find((t) => t.name === theme)?.emoji || '🌑'} Theme
                </Button>
              </li>
            </MenuItem>
<<<<<<< HEAD
            <Popover placement='right bottom'>
              <Menu className="dialog h-96 w-full max-h-96 flex-nowrap overflow-y-auto">
                {themes.map((t) => (
                  <MenuItem>
                    <li key={t.name} data-theme={t.name} className='bg-transparent m-2'>
                      <label
                        className={`cursor-pointer btn btn-block px-0 ${
                          t.name === theme && 'border-2 border-base-300'
                        }`}
                      >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className={`shrink-0 ${t.name === theme ? 'visible' : 'invisible'}`}
                          >
                            <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                          </svg>
=======
            <Popover placement="right bottom">
              <Menu className="dialog h-96 max-h-96 w-full flex-nowrap overflow-y-auto">
                {themes.map((t) => (
                  <MenuItem key={t.name}>
                    <li
                      data-theme={t.name}
                      className="m-2 bg-transparent"
                    >
                      <label
                        className={`btn btn-block cursor-pointer px-0 ${
                          t.name === theme && 'border-2 border-base-300'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className={`shrink-0 ${t.name === theme ? 'visible' : 'invisible'}`}
                        >
                          <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"></path>
                        </svg>
>>>>>>> de5665e1dc9bcf5264705c4dca68b42bf1be34dc

                        <span className="capitalize">
                          {t.emoji} {t.name}
                        </span>
                        <input
                          type="radio"
                          name="theme-radios"
                          data-theme={t.name}
                          className="theme-controller invisible"
                          value={t.name}
                          onClick={() => setTheme(t.name)}
                        />
                        <div className="space-x-1">
                          <span className="badge badge-primary badge-xs"></span>
                          <span className="badge badge-secondary badge-xs"></span>
                          <span className="badge badge-accent badge-xs"></span>
                          <span className="badge badge-neutral badge-xs"></span>
                        </div>
                      </label>
                    </li>
                  </MenuItem>
                ))}
              </Menu>
            </Popover>
          </SubmenuTrigger>
          <MenuItem>
            <li>
              <button onClick={onSignOut} className="capitalize">
                Sign Out
              </button>
            </li>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}
