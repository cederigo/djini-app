/**
 * # globalReducer.js
 */

import {
  MY_PROFILE_LOADED,
  LOGIN_SUCCESS,
  PROFILE_UPDATE_SUCCESS,
  LOGOUT
} from '../../lib/constants'

import InitialState from './globalInitialState';
import {User} from '../../lib/types'

const initialState = new InitialState;

/**
 * Helpers
 */
export function fromParseUser(user: Object): User {
  return {
    id: user.id,
    name: user.get('name'),
    birthday: user.get('birthday'),
    registered: user.get('registered'),
    phoneNumber: user.get('username')
  }
}

export default function globalReducer(state = initialState, {type, payload}) {
  switch (type) {
    case PROFILE_UPDATE_SUCCESS:
    case LOGIN_SUCCESS:
      return state.set('currentUser', fromParseUser(payload))
    case LOGOUT:
      return state.set('currentUser', null)
    case MY_PROFILE_LOADED:
      return state.set('currentUser', fromParseUser(payload.user))
  }

  return state;
}
