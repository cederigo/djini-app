/**
 * # globalReducer.js
 */

import {
  SESSION_TOKEN_SUCCESS,
  PROFILE_UPDATE_SUCCESS,
  LOGIN_SUCCESS,
  CURRENT_USER_SUCCESS,
  LOGOUT
} from '../../lib/constants'

import InitialState from './globalInitialState';

const initialState = new InitialState;

export default function globalReducer(state = initialState, {type, payload}) {

  switch (type) {
    case SESSION_TOKEN_SUCCESS:
      return state.set('sessionToken', payload);

    case LOGIN_SUCCESS:
      return state.set('currentUser', payload)
        .set('sessionToken', payload.sessionToken)

    case CURRENT_USER_SUCCESS:
    case PROFILE_UPDATE_SUCCESS:
      return state.set('currentUser', payload);

    case LOGOUT:
      return state.set('currentUser', null)
        .set('sessionToken', '')
  }

  return state;
}
