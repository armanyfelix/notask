import { Button, Menu } from 'react-aria-components'
import FlagDynamicIcon from '../assets/svgs/FlagDynamicIcon'

interface Props {
  btnStyles?: string
  position?: string
}

export default function PriorityMenu({ btnStyles }: Props) {
  return (
    <Menu>
      <Button className={btnStyles || ''}>
        <FlagDynamicIcon className="fill-none stroke-current" />
      </Button>
      {/* <Menu.Items
          className={`menu fixed rounded-box ${
            position ? position : '-left-28 top-0'
          } z-50 w-40 bg-base-300/80 backdrop-blur-lg`}
        >
          <Menu.Item disabled>
            <li>
              <span className="menu-title">Priority</span>
            </li>
          </Menu.Item>
          <Menu.Item>
            <li>
              <button>
                <FlagDynamicIcon className="fill-red-500" />
                High
              </button>
            </li>
          </Menu.Item>
          <Menu.Item>
            <li>
              <button>
                <FlagDynamicIcon className="fill-yellow-500" />
                Medium
              </button>
            </li>
          </Menu.Item>
          <Menu.Item>
            <li>
              <button>
                <FlagDynamicIcon className="fill-blue-500" />
                Low
              </button>
            </li>
          </Menu.Item>
          <Menu.Item>
            <li>
              <button>
                <FlagDynamicIcon className="fill-none stroke-current" />
                None
              </button>
            </li>
          </Menu.Item>
        </Menu.Items> */}
    </Menu>
  )
}
