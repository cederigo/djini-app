import {Record} from 'immutable';

const Wish = Record({
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
  fulfillerName: '',
})

const InitialState = Record({
  isFetching: false,
  error: null,
  editMode: false,
  source: 'wishes', // wishes or friend
  wish: new Wish,
  wishOfFriend: new Wish
})

export default InitialState;
