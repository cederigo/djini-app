import {Record} from 'immutable';

const InitialState = Record({
  isFetching: false,
  error: null,
  isEditable: false,
  wish: new (Record({
    id: undefined,
    title: '',
    description: '',
    url: '',
    seenAt: '',
    isPrivate: false,
    fromUserId: '',
    toUserId: '',
  }))
})

export default InitialState;