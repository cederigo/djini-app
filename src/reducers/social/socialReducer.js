import InitialState from './socialInitialState';

import {
  FRIENDS_REQUEST,
  FRIENDS_SUCCESS,
  FRIENDS_FAILURE,

  CONTACTS_REQUEST,
  CONTACTS_SUCCESS,
  CONTACTS_FAILURE,

  SEARCH_FRIENDS,
  UPDATE_FRIENDS,
  SAVE_FRIENDS,

  INVITE_FRIEND,
  SHOW_FRIEND
} from '../../lib/constants'

const initialState = new InitialState;


export default function socialReducer(state = initialState, {type, payload}) {
  switch(type) {
    case FRIENDS_REQUEST:
    case CONTACTS_REQUEST:
      return state.set('isFetching', true)

    case FRIENDS_SUCCESS:
      return state.set('isFetching', false)
        .set('friends', payload)

    case UPDATE_FRIENDS: {
      return state.set('friends', payload)
    }

    case SAVE_FRIENDS: {
      return state.set('lastSavedAt', payload)
    }

    case CONTACTS_SUCCESS: {
      const existingFriends = state.get('friends')
      const friends = payload
      return state.set('isFetching', false)
        .set('friends', friends.mergeDeep(existingFriends))
    }

    case FRIENDS_FAILURE:
    case CONTACTS_FAILURE:
      return state.set('isFetching', false)
        .set('error', payload)

    case SEARCH_FRIENDS:
        return state.set('filterText', payload)

    case SHOW_FRIEND:
    case INVITE_FRIEND: {
      const {phoneNumber, timestamp} = payload
      return state.updateIn(['friends', phoneNumber], friend => {
        friend.accessedAt = timestamp
        return friend
      })
    }
  
  }
  return state;
}
