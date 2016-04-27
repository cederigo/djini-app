export type User = {
  id: string,
  name: string,
  birthday: Date
}

export type Wish = {
  id: string,
  title: string,
  url: string,
  description: string,
  private: boolean,
  userId: string,
  ownerId: string
}
