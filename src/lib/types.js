export type User = {
  id: string,
  name: string,
  phoneNumber: string,
  birthday: Date,
  registered: bool
}

export type Wish = {
  id: string,
  title: string,
  url: string,
  description: string,
  private: bool,
  userId: string,
  ownerId: string
}