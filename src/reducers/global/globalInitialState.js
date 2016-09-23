import {Record} from 'immutable'
import {User} from '../../lib/types'

var InitialState = Record({
  currentUser: User,
  badges: new (Record({
    wishesTab: false,
    contactsTab: false,
    notesTab: false,
    profileTab: false,
  }))
});

export default InitialState;
