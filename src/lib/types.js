/* @flow */

/* Server */
export type User = {
  id: string,
  name: string,
  email: string,
  phoneNumber: string,
  birthday: string,
  registered: bool
}

/* Local (From adressbook) */
export type Contact = {
  phoneNumber: string,
  name: string,
  nameTransliterated: string,
  birthday: string,
}

/* Wish or Idea (technically its the same thing) */
export type Wish = {
  id: string,
  title: string,
  url: string,
  description: string,
  price: string,
  seenAt: string,
  isPrivate: bool,
  isFavorite: bool,
  fromUserId: string,
  toUserId: string,
  fulfillerId: string,
  fulfillerName: ?string,
}

export type Note = {
  id: ?string,
  title: string,
  comment: string,
  dueDate: string, // YYYY-MM-DD
  type: 'reminder' | 'task', 
  done: boolean, // For type task
  contact: Contact, // A note is always associated with one of our contacts
  wish: ?Wish, // For type task
}
