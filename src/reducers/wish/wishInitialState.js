import {Record} from 'immutable';

const InitialState = Record({
  isFetching: false,
  error: null,
  editMode: false,
  wish: new (Record({
    id: undefined,
    title: '',
    description: '',
    url: '',
    seenAt: '',
    isPrivate: false,
    isFavorite: false,
    fromUserId: '',
    toUserId: '',
    fulfillerId: '',
    fulfillerName: '',
  }))
})

export default InitialState;