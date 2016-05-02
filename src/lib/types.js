export type User = {
  id: string,
  name: string,
  phoneNumber: any, //TODO
  birthday: Date
}

export type Wish = {
  id: string,
  title: string,
  url: string,
  description: string,
  private: boolean,
  userId: string,
  userPhoneNumber: any, // only used if userId is not set 
  ownerId: string
}
