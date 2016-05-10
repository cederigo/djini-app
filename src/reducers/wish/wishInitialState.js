import {Record} from 'immutable';

const InitialState = Record({
  isFetching: false,
  error: null,
  editMode: false,
  showFullfillButton: false,
  showUnfullfillButton: false,
  showEditButton: false,
  showSaveButton: false,
  showDeleteButton: false,
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