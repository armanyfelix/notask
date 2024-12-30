import { useState } from 'react'
import {
  Button,
  Cell,
  Checkbox,
  Column,
  ColumnProps,
  ColumnResizer,
  Menu,
  MenuItem,
  MenuTrigger,
  Popover,
  ResizableTableContainer,
  Row,
  SortDescriptor,
  Table,
  TableBody,
  TableHeader,
} from 'react-aria-components'

// interface Props {
//   settings: any
//   elements: Signal<any>
//   handleOpenElement: any
//   onDeleteElement: any
//   onAddElement: any
// }

interface ResizableTableColumnProps<T> extends Omit<ColumnProps, 'children'> {
  children: React.ReactNode
}

let initialColumns = [
  { name: 'Name', id: 'name', width: 10 },
  { name: 'Description', id: 'description', width: 20 },
  { name: 'Priority', id: 'priority', width: 10 },
  { name: 'Start date', id: 'start_date', width: 10 },
  { name: 'End date', id: 'end_date', width: 10 },
]

export default function TableView({ items, selectItem }: any) {
  let [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  })
  let [columns, setColumns] = useState(() => {
    let localStorageWidths = localStorage.getItem('table-widths')
    if (localStorageWidths) {
      let widths = JSON.parse(localStorageWidths)
      return initialColumns.map((col) => ({ ...col, width: widths[col.id] }))
    } else {
      return initialColumns
    }
  })

  // items.value.sort((a: any, b: any) => {
  //   let d = a[sortDescriptor.column || 0].localeCompare(
  //     b[sortDescriptor.column || 0],
  //   )
  //   return sortDescriptor.direction === 'descending' ? -d : d
  // })

  let onResize = (widths: any) => {
    setColumns((columns) =>
      columns.map((col) => ({ ...col, width: widths.get(col.id) })),
    )
  }

  let onResizeEnd = (widths: any) => {
    localStorage.setItem(
      'table-widths',
      JSON.stringify(Object.fromEntries(widths)),
    )
  }

  return (
    <ResizableTableContainer
      className="overflow-auto"
      onResize={onResize}
      onResizeEnd={onResizeEnd}
    >
      <Table
        aria-label="Table"
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        onRowAction={(e) => selectItem(e)}
        className="table w-full"
      >
        <TableHeader>
          <Column id="select" width={10}>
            <Checkbox slot="selection" className="input" />
          </Column>
          <Column id="status" width={30}>
            Status
          </Column>
          {columns.map((column: any) => (
            <ResizableTableColumn
              id={column.id}
              isRowHeader={column.id === 'name'}
              allowsSorting
              width={column.width}
            >
              {column.name}
            </ResizableTableColumn>
          ))}
          {/* <ResizableTableColumn id="priority" allowsSorting>
            Priority
          </ResizableTableColumn>
          <ResizableTableColumn id="start_date" allowsSorting>
            Start Date
          </ResizableTableColumn>
          <ResizableTableColumn id="end_date" allowsSorting>
            End Date
          </ResizableTableColumn> */}
        </TableHeader>
        <TableBody
          className="empty:text-center"
          renderEmptyState={() => 'No results found.'}
        >
          {items.value?.map((item: any, i: number) => (
            <Row key={item.id} id={i} className="cursor-pointer hover:bg-neutral focus:bg-neutral transform duration-200 ease-linear">
              <Cell className="">
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </Cell>
              <Cell>
                <Button className="btn btn-sm">
                  <span className="text-nowrap">in progress</span>
                </Button>
              </Cell>
              <Cell className="">{item.name}</Cell>
              <Cell className="">{item.description}</Cell>
              <Cell className="">{item.priority}</Cell>
              <Cell className="pl-">{item.start_date}</Cell>
              <Cell className="pl-">{item.end_date}</Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
    </ResizableTableContainer>
  )
}

function ResizableTableColumn<T extends object>(
  props: ResizableTableColumnProps<T>,
) {
  return (
    <Column {...props}>
      {({ startResize, sort, allowsSorting, sortDirection }) => (
        <div className="group flex items-center justify-between">
          <div className="flex w-full items-center">
            <MenuTrigger>
              <Button className="btn btn-ghost btn-sm">{props.children}</Button>
              <Popover>
                <Menu
                  onAction={(action) => {
                    if (action === 'sortAscending') {
                      sort('ascending')
                    } else if (action === 'sortDescending') {
                      sort('descending')
                    } else if (action === 'resize') {
                      startResize()
                    }
                  }}
                  className="dialog menu menu-xs"
                >
                  <MenuItem id="sortAscending">
                    <li>
                      <Button>Sort Ascending</Button>
                    </li>
                  </MenuItem>
                  <MenuItem id="sortDescending">
                    <li>
                      <Button>Sort Descending</Button>
                    </li>
                  </MenuItem>
                  <MenuItem id="resize">
                    <li>
                      <Button>Resize</Button>
                    </li>
                  </MenuItem>
                </Menu>
              </Popover>
            </MenuTrigger>
            {allowsSorting && (
              <span aria-hidden="true">
                {sortDirection === 'ascending' ? (
                  <span className="icon-[solar--alt-arrow-up-bold]"></span>
                ) : (
                  <span className="icon-[solar--alt-arrow-down-bold]"></span>
                )}
              </span>
            )}
          </div>
          <ColumnResizer className="invisible box-border h-7 w-1 transform cursor-col-resize rounded-xl bg-base-300 duration-200 ease-in-out hover:brightness-150 group-hover:visible" />
        </div>
      )}
    </Column>
  )
}
