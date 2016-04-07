/**
 * # deviceReducer.js
 */

import InitialState from './deviceInitialState';

import { SET_PLATFORM, SET_VERSION } from '../../lib/constants'

const initialState = new InitialState;

export default function deviceReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState.merge(state);

  switch (action.type) {
    case SET_PLATFORM:
      return state.set('platform', action.platform);

    case SET_VERSION:
      return state.set('version', action.payloadversion);
  }

  return state;
}
