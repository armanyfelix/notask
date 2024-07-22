import {
  Button,
  Link,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
} from 'react-aria-components'

export default function NotificationsDialog() {
  return (
    <MenuTrigger>
      <Button aria-label="Inbox" className="btn btn-square btn-ghost btn-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.25rem"
          height="1.25rem"
          viewBox="0 0 24 24"
        >
          <g fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path
              strokeLinecap="round"
              d="M14 2.005C13.385 2 12.72 2 12 2C7.286 2 4.929 2 3.464 3.464C2 4.93 2 7.286 2 12c0 4.714 0 7.071 1.464 8.535C4.93 22 7.286 22 12 22c4.714 0 7.071 0 8.535-1.465C22 19.072 22 16.714 22 12c0-.72 0-1.385-.005-2"
            ></path>
            <circle cx={19} cy={5} r={3}></circle>
            <path
              strokeLinecap="round"
              d="M2 13h3.16c.905 0 1.358 0 1.756.183c.398.183.692.527 1.281 1.214l.606.706c.589.687.883 1.031 1.281 1.214c.398.183.85.183 1.756.183h.32c.905 0 1.358 0 1.756-.183c.398-.183.692-.527 1.281-1.214l.606-.706c.589-.687.883-1.031 1.281-1.214c.398-.183.85-.183 1.756-.183H22"
              opacity={0.5}
            ></path>
          </g>
        </svg>
      </Button>
      <Popover placement='right top'>
        {/* <OverlayArrow>
          <svg
            viewBox="0 0 12 12"
            className="block h-4 w-4 fill-base-300 group-placement-bottom:rotate-180"
          >
            <path d="M0 0L6 6L12 0" />
          </svg>
        </OverlayArrow> */}
        <Menu className="dialog menu">
          <MenuItem>
            <li>
              <Notification
                avatar="https://images.unsplash.com/photo-1569913486515-b74bf7751574?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                name="Sonja Balmann"
                time="2h"
                text="This looks great! Let's ship it."
              />
            </li>
          </MenuItem>
          <MenuItem>
            <li>
              <Notification
                avatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                name="Maia Pettegree"
                time="4h"
                text="Can you add a bit more pizzazz?"
              />
            </li>
          </MenuItem>
          <MenuItem>
            <li>
              <Notification
                avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                name="Charles Webb"
                time="1d"
                text="Here's a first pass. What do you think?"
              />
            </li>
          </MenuItem>
        </Menu>
      </Popover>
    </MenuTrigger>
  )
}

function Notification({ avatar, name, time, text }: any) {
  return (
    <Link href="#" className="flex items-start justify-between">
      <img src={avatar} className="h-7 w-7 rounded-full" />
      <div className="w-full">
        <div className="font-semibol leading-5">{name}</div>
        <p className="mb-0 mt-1 line-clamp-2 overflow-hidden text-ellipsis text-sm">
          {text}
        </p>
        <div className="text-xs">Commented {time} ago</div>
      </div>
      <span className="icon-[solar--chat-unread-bold-duotone] h-5 w-5"></span>
    </Link>
  )
}
