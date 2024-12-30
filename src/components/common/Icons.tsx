import { Icon } from '@iconify-icon/react/dist/iconify.mjs'
import {
  Button,
  Input,
  OverlayArrow,
  TabPanel,
  Tooltip,
  TooltipTrigger,
} from 'react-aria-components'
import { Signal, signal } from '@preact/signals-react'
import { useEffect } from 'react'
import { AutoSizer, Grid } from 'react-virtualized'
import colors from '@/data/colors.json'

// const color = signal<string>('')
const icons = signal<any>(null)
const allIcons = signal<any>([])

export default function Icons({ selectedIcon }: any) {
  const getIcons = async () => {
    fetch('/src/data/icons-tabler.json')
      .then((response) => response.json())
      .then((data) => {
        icons.value = data
        allIcons.value = data
      })
  }

  const onSearch = (e: any) => {
    const value = e.target.value
    if (value === '') {
      icons.value = allIcons.value
    }
    const filteredData = icons.value.filter((icon: any) => {
      if (value === '') {
        return icon
      } else {
        return icon.toLowerCase().includes(value)
      }
    })
    icons.value = filteredData
  }
  useEffect(() => {
    getIcons()
  }, [])

  return (
    <TabPanel id="icon" className="min-h-72">
      <div className="my-3">
        <div className="max-w-96 pb-1 text-center">
          {colors.map((c: string) => (
            <Button
              className="m-1 h-6 w-6 rounded-full"
              style={{ backgroundColor: c }}
              onPress={() => (selectedIcon.value = { ...selectedIcon.value, color: c })}
            ></Button>
          ))}
        </div>
        <Input
          className="input input-sm w-full"
          placeholder="search"
          onInput={onSearch}
        />
      </div>
      {icons.value && (
        <AutoSizer>
          {({ width, height }: any) => (
            <Grid
              cellRenderer={cellRenderer(selectedIcon)}
              columnCount={10}
              columnWidth={38}
              style={{ color: selectedIcon.value.color }}
              height={height}
              rowCount={icons.value?.length}
              rowHeight={38}
              width={width}
              selectedIcon={selectedIcon}
            />
          )}
        </AutoSizer>
      )}
    </TabPanel>
  )
}

const cellRenderer =
  (selectedIcon: any) =>
  ({ key, rowIndex, columnIndex, style }: any) => {
    const index = rowIndex * 10 + columnIndex

    return (
      <div key={key} style={style}>
        <IconItem
          icon={icons.value[index]}
          selectedIcon={selectedIcon}
        />
      </div>
    )
  }

const IconItem = ({ icon, selectedIcon }: any) => {
  return (
    <TooltipTrigger>
      <Button
        className="btn btn-square btn-ghost btn-sm"
        style={{ color: selectedIcon.value.color }}
        onPress={() =>
          (selectedIcon.value = {
            color: selectedIcon.value.color,
            name: icon,
          })
        }
      >
        <Icon icon={`tabler:${icon}`} width="1.9em" height="1.9em" />
      </Button>
      <Tooltip className="rounded-box bg-base-100 px-2 py-1 text-sm">
        <OverlayArrow>
          <svg width={8} height={8} viewBox="0 0 8 8" className="fill-base-100">
            <path d="M0 0 L4 4 L8 0" />
          </svg>
        </OverlayArrow>
        {icon}
      </Tooltip>
    </TooltipTrigger>
  )
}
