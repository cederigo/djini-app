/* @flow */

export type User = {
  id: string,
  name: string,
  email: string,
  phoneNumber: string,
  birthday: string,
  registered: bool
}

export type Contact = {
  phoneNumber: string,
  name: string,
  nameTransliterated: string,
  birthday: string,
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

export type Note = {
  id: ?string,
  title: string,
  description: string,
  type: 'reminder' | 'task', 
  done: boolean, // For type task
  dueDate: ?Date,
  wish: ?Wish,
}
