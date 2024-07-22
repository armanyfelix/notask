export interface Status {
  id: number
  name: string
  color: string
}

export interface Statuses {
  open: Status[] | undefined
  active: Status[] | undefined
  done: Status[] | undefined
  close: Status[] | undefined
}

export interface Dates {
  start_date: boolean
  due_date: boolean
  reminders: boolean
  repeats: boolean
}

export interface Priority {
  id: number
  name: string
  color: string
}
export interface Tags {
  id: number
  name: string
  color: string
}

export interface Fields {
  [key: string]: any
}

export interface Attributes {
  statuses: Statuses | null
  dates: Dates | null
  priority: Priority[] | null
  tags: Tags[] | null
  fields: Fields | null
  tracker: boolean | null
  relationships: boolean | null
  members: boolean | null
}

export interface AttributesSets {
  id: number
  name: string
  description: string
  item_name: string
  attributes: Attributes
}
