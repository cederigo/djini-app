import {Map} from 'immutable';
import InitialState from './socialInitialState';

import {
  FRIENDS_REQUEST,
  FRIENDS_SUCCESS,
  FRIENDS_FAILURE,

  CONTACTS_REQUEST,
  CONTACTS_SUCCESS,
  CONTACTS_FAILURE
} from '../../lib/constants'

const initialState = new InitialState;

export default function socialReducer(state = initialState, {type, payload}) {
  switch(type) {
    case FRIENDS_REQUEST:
    case CONTACTS_REQUEST:
      return state.set('isFetching', true)

    case FRIENDS_SUCCESS:
      return state.set('isFetching', false)
        .set('friends', Map(payload))

    case CONTACTS_SUCCESS: {
      const friends = Map(payload)
      return state.set('isFetching', false)
        .set('friends', friends.mergeDeep(state.get('friends')))
    }

    case FRIENDS_FAILURE:
    case CONTACTS_FAILURE:
      return state.set('isFetching', false)
        .set('error', payload)
  
  }
  return state;
}
