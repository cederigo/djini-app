/**
 * # globalReducer.js
 */

import {
  SET_SESSION_TOKEN,
  LOGIN_SUCCESS
} from '../../lib/constants'

import InitialState from './globalInitialState';

const initialState = new InitialState;

export default function globalReducer(state = initialState, action) {

  switch (action.type) {
    case SET_SESSION_TOKEN:
      return state.set('sessionToken', action.payload);

    case LOGIN_SUCCESS:
      return state.set('currentUser', action.payload);
  }

  return state;
}
