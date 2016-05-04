import {Record} from 'immutable'

export type User = {
  id: string,
  name: string,
  phoneNumber: any, //TODO
  birthday: Date,
  registered: boolean
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

export const ImmutableWish = Record({
  id: '',
  title: '',
  url: '',
  description: '',
  seenAt: '',
  private: false,
  fullfillerId: '',
  ownerId: '',
  userId: ''
})