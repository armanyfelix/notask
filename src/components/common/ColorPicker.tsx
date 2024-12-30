import { Button, Menu } from 'react-aria-components'
import colors from '../../data/colors.json'

interface Props {
  item: any
  index: number
  onChangeColor: (color: string, item: any, index: number) => void
}

export default function ColorPicker({ item, index, onChangeColor }: Props) {
  return (
    <Menu>
      <Button
        className={`mx-2 h-5 w-5 rounded-full bg-${item.color}-500`}
      ></Button>
      {/* <Menu.Items className="absolute -top-40 z-50 max-w-xs gap-3 rounded-box bg-neutral p-4">
        <h3 className="mb-2 font-bold">COLOR</h3>
        {colors.map((color) => (
          <Menu.Item>
            <input
              type="button"
              className={`bg-${color}-500 mr-2 h-6 w-6 cursor-pointer rounded-full ring-primary hover:ring-4`}
              onClick={() => onChangeColor(color, item, index)}
            />
          </Menu.Item>
        ))}
      </Menu.Items> */}
    </Menu>
  )
}
