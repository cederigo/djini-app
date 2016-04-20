import {Map} from 'immutable';
import InitialState from './socialInitialState';

import {
  FRIENDS_REQUEST,
  FRIENDS_SUCCESS,
  FRIENDS_FAILURE,

  CONTACTS_REQUEST,
  CONTACTS_SUCCESS,
  CONTACTS_FAILURE,

  SEARCH_FRIENDS
} from '../../lib/constants'

const initialState = new InitialState;

const sortFriends = function (f1, f2) {
  const n1 = f1.registered ? '0' + f1.name : f1.name
  const n2 = f2.registered ? '0' + f2.name : f2.name
  return n1 == n2 ? 0 : (n1 < n2 ? -1 : 1)
}

export default function socialReducer(state = initialState, {type, payload}) {
  switch(type) {
    case FRIENDS_REQUEST:
    case CONTACTS_REQUEST:
      return state.set('isFetching', true)

    case FRIENDS_SUCCESS:
      return state.set('isFetching', false)
        .set('friends', Map(payload).sort(sortFriends))

    case CONTACTS_SUCCESS: {
      const existingFriends = state.get('friends')
      const friends = Map(payload).sort(sortFriends) //eager operation
      return state.set('isFetching', false)
        .set('friends', friends.mergeDeep(existingFriends))
    }

    case FRIENDS_FAILURE:
    case CONTACTS_FAILURE:
      return state.set('isFetching', false)
        .set('error', payload)

    case SEARCH_FRIENDS:
        return state.set('filterText', payload)
  
  }
  return state;
}
