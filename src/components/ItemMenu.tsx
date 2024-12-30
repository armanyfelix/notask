import DotsIcon from '../assets/svgs/dotsBold.svg?react'
import TrashIcon from '../assets/svgs/trash.svg?react'
import DuplicateIcon from '../assets/svgs/duplicate.svg?react'
import MoveIcon from '../assets/svgs/move.svg?react'
import LinkIcon from '../assets/svgs/link.svg?react'
import { Button, Menu } from 'react-aria-components'

interface Props {
  id: number
  onDeleteItem: any
}

export default function ItemMenu({}: any) {
  return (
    <Menu>
      <Button
        className="btn btn-square btn-ghost btn-sm"
        onPress={(e: any) => e.stopPropagation()}
      >
        <DotsIcon />
      </Button>
      {/* <Menu.Items className="menu absolute right-0 z-50 cursor-auto rounded-box bg-base-300">
        <Menu.Item>
          <li>
            <button>
              <LinkIcon className="h-5 w-5" />
              Copy link
            </button>
          </li>
        </Menu.Item>{' '}
        <Menu.Item>
          <li>
            <button>
              <MoveIcon className="h-5 w-5" />
              Move
            </button>
          </li>
        </Menu.Item>
        <Menu.Item>
          <li>
            <button>
              <DuplicateIcon className="h-5 w-5" />
              Duplicate
            </button>
          </li>
        </Menu.Item>
        <Menu.Item>
          <li>
            <button onClick={() => onDeleteElement(id)}>
              <TrashIcon className="h-5 w-5 stroke-error" />
              Delete
            </button>
          </li>
        </Menu.Item>
      </Menu.Items> */}
    </Menu>
  )
}
