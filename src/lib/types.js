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