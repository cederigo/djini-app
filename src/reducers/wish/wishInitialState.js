import { Record } from 'immutable'

export const Wish = Record({
  id: undefined,
  title: '',
  description: '',
  price: '',
  url: '',
  seenAt: '',
  isPrivate: false,
  isFavorite: false,
  imageURL: '',
  fromUserId: '',
  toUserId: '',
  fulfillerId: '',
  fulfillerName: ''
})

const InitialState = Record({
  isFetching: false,
  error: null,
  editMode: false,
  source: 'wishes', // wishes or friend
  wish: new Wish(),
  wishOfFriend: new Wish(),
  contact: undefined // Local contact associated to friend
})

export default InitialState
