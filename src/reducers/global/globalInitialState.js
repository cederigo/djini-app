import {Record} from 'immutable'
import {User} from '../../lib/types'

var InitialState = Record({
  currentUser: User,
});

export default InitialState;
