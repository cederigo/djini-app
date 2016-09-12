/* @flow */

export type User = {
  id: string,
  name: string,
  email: string,
  phoneNumber: string,
  birthday: Date,
  registered: bool
}

export type Contact = {
  phoneNumber: string,
  name: string,
  nameForSearch: string
}

export type Wish = {
  id: string,
  title: string,
  url: string,
  description: string,
  seenAt: string,
  createdAt: Date,
  isPrivate: bool,
  isFavorite: bool,
  fromUserId: string,
  toUserId: string,
  fulfillerId: string,
  fulfillerName: ?string,
}

export type Reminder = {
  date: Object,
  title: string,
  text: string
}

export type Todo = {
  id: string,
  title: string,
  description: string,
  type: 'find-gift' | 'buy-gift', 
  done: boolean,
  dueDate: Object,
  contactName: string,
  wish: Wish,
  reminders: Array<Reminder>
}
