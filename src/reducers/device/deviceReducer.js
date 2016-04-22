import InitialState from './deviceInitialState';

import { SET_PLATFORM, SET_VERSION } from '../../lib/constants'

const initialState = new InitialState;

export default function deviceReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PLATFORM:
      return state.set('platform', action.payload);

    case SET_VERSION:
      return state.set('version', action.payload);
  }
  return state;
}
