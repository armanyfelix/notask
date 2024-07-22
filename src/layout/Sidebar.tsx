import { signal } from '@preact/signals-react'
import ChevronLeftIcon from '../assets/svgs/chevronLeft.svg?react'
import { useEffect, useRef } from 'react'
import {
  AccountState,
  UIState,
  useAccountStore,
  useSessionStore,
  useUIStore,
} from '../utils/zustand'
import ListsExplorer from './ListsExplorer'
import SpaceExplorer from './SpaceExplorer'
import supabase from '../utils/supabase'
import { addImageUrl } from '../helpers/images'
import CreateModal from '@/components/CreateModal'
import NotificationsDialog from './NotificationsDialog'
import UserDropdown from '@/components/UserDropdown'
import { Button } from 'react-aria-components'

const space = signal<any>(null)
const page = signal<string>('')
// const openCreateSpace = signal<boolean>(false)
const spaces = signal<any>(null)
// const favorites = signal<any>([])

export default function Sidebar() {
  const { account, setAccount } = useAccountStore((s: AccountState) => s)
  const session = useSessionStore((s: any) => s.session)

  const {
    setOpenSpacesSidebar,
    openSpacesSidebar,
    openFavoritesSidebar,
    setOpenFavoritesSidebar,
    openExplorer,
    setOpenExplorer,
  } = useUIStore((s: UIState) => s)

  const refBox = useRef(null)
  const refRight = useRef(null)

  const routes = [
    {
      name: 'lists',
      icon: (
        <span className="icon-[solar--checklist-minimalistic-bold-duotone] h-6 w-6"></span>
      ),
    },
    {
      name: 'notes',
      icon: <span className="icon-[solar--book-2-bold-duotone] h-6 w-6"></span>,
    },
  ]

  const onOpenSpace = (s: any) => {
    setOpenExplorer(page.value === s.name ? !openExplorer : true)
    space.value = s
    page.value = s.name
  }

  const onToggle = (p: string, a: string) => {
    setOpenExplorer(page.value === a ? !openExplorer : true)
    space.value = null
    page.value = p
  }

  async function getSpaces() {
    if (account) {
      const { data } = await supabase
        .from('spaces')
        .select('*')
        .eq('account', account?.id)
      if (data?.length) {
        const dataWithImages = await addImageUrl(data)
        spaces.value = dataWithImages
      }
    }
  }

  async function getFavorites() {
    if (account) {
      const { data } = await supabase
        .from('lists')
        .select('*')
        .eq('favorite', true)
      if (data) {
        const withImages = await addImageUrl(data)
        return withImages
      }
    }
  }

  useEffect(() => {
    const resizeableElement = refBox.current as unknown as HTMLElement
    if (resizeableElement) {
      const styles = window.getComputedStyle(resizeableElement)
      let width = parseInt(styles.width, 10)
      let xCord = 0
      const onMouseMoveRightResize = (e: any) => {
        const dx = e.clientX - xCord
        xCord = e.clientX
        width += dx
        if (width > 200 && width < 700) {
          resizeableElement.style.width = `${width}px`
        }
      }
      const onMouseUpRightResize = () => {
        document.removeEventListener('mousemove', onMouseMoveRightResize)
      }
      const onMouseDownRightResize = (e: any) => {
        xCord = e.clientX
        resizeableElement.style.left = styles.left
        resizeableElement.style.right = '0'
        document.addEventListener('mouseup', onMouseUpRightResize)
        document.addEventListener('mousemove', onMouseMoveRightResize)
      }
      const resizerRight = refRight.current as any
      resizerRight.addEventListener('mousedown', onMouseDownRightResize)

      return () => {
        resizerRight.removeEventListener('mousedown', onMouseDownRightResize)
      }
    }
  }, [])

  useEffect(() => {
    if (!page.value) {
      setOpenExplorer(false)
    }
    getSpaces()
    getFavorites()
  }, [])

  return (
    <aside className="flex h-screen max-h-screen">
      <section className="sticky bottom-0 left-0 top-0 z-50 bg-base-200">
        <ul className="flex flex-col items-center justify-center mt-1 space-y-1">
          <li>
            <UserDropdown session={session} />
          </li>
          <li>
            <NotificationsDialog />
          </li>
          <li>
            <CreateModal accountId={account?.id} spaces={spaces} />
          </li>
          <li>
            <Button className="btn btn-square btn-ghost btn-sm">
              <span className="icon-[solar--rounded-magnifer-line-duotone] w-5 h-5"></span>
            </Button>
          </li>
          <span className="divider"></span>
          {routes.map((r, i) => (
            <li key={i} className="tooltip tooltip-right" data-tip={r.name}>
              <button onClick={() => onToggle(r.name, r.name)}>{r.icon}</button>
            </li>
          ))}
        </ul>
        <div>
          <button
            onClick={() => setOpenFavoritesSidebar(!openFavoritesSidebar)}
            className="group btn btn-ghost btn-xs m-0 w-full p-0 text-xs font-medium lowercase tracking-tighter opacity-50"
          >
            <span className="icon-[solar--star-fall-bold] h-6 w-6"></span>
            <span
              className={`${openFavoritesSidebar && '-rotate-90'} icon-[solar--alt-arrow-left-linear] h-3 w-3`}
            ></span>
          </button>
          <div>
            {openFavoritesSidebar && (
              <ul className="menu menu-xs space-y-3">
                <li className="items-center">
                  <a
                    href="/"
                    className="hover:bg-opacity-9 tooltip tooltip-right rounded-btn p-2 leading-[0]"
                    data-tip="planet"
                  >
                    <span className="icon-[solar--star-linear] h-6 w-6"></span>
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
        <div>
          <button
            onClick={() => setOpenSpacesSidebar(!openSpacesSidebar)}
            className="group btn btn-ghost btn-xs m-0 w-full p-0 text-xs font-medium lowercase tracking-tighter opacity-50"
          >
            <span className="icon-[solar--planet-4-bold] h-5 w-5"></span>
            <ChevronLeftIcon
              className={`h-3 w-3 ${openSpacesSidebar && '-rotate-90'}`}
            />
          </button>
          <div>
            {openSpacesSidebar && (
              <ul className="mt-2 flex flex-col items-center space-y-3">
                {spaces.value &&
                  spaces.value.map((s: any) => (
                    <li key={s.id}>
                      <button
                        className={`tooltip tooltip-right rounded-btn p-2 leading-[0] hover:bg-opacity-90 ${
                          s.color && `bg-${s.color}-500`
                        }`}
                        data-tip={s.name}
                        onClick={() => {
                          onOpenSpace(s)
                        }}
                      >
                        {!s.image_url && !s.emoji && (
                          <span className="icon-[solar--planet-bold-duotone] h-6 w-6"></span>
                        )}
                        {s.image_url && (
                          <img
                            src={s.image_url}
                            width={24}
                            height={24}
                            alt=""
                          />
                        )}
                        {!s.image_url && s.emoji && (
                          <img src={s.emoji} width={24} height={24} alt="" />
                        )}
                      </button>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
        <span className="divider"></span>
        <div className="flex flex-col items-center justify-end">
          {/* <button
            className="btn btn-square btn-sm tooltip tooltip-right scale-75"
            data-tip="Create space"
            onClick={() => (openCreateSpace.value = true)}
          >
            <span className="icon-[solar--add-circle-linear]"></span>
          </button> */}


        </div>
      </section>
      <section
        ref={refBox}
        className={`${
          openExplorer
            ? 'w-56 translate-x-0 scale-100 border-l-2 border-base-300'
            : 'w-0 !-translate-x-96 scale-50'
        } box-border overflow-auto bg-base-200 py-2`}
      >
        {page.value === 'lists' && <ListsExplorer />}
        {openExplorer && space.value && (
          <SpaceExplorer
            space={space}
            account={account}
            setAccount={setAccount}
          />
        )}
        <div
          ref={refRight}
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-base-300"
        ></div>
      </section>
    </aside>
  )
}
