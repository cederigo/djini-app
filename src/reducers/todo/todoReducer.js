/* @flow */

import InitialState from './todoInitialState'

import { EDIT_NOTE, SHOW_NOTE, UPDATE_NOTE } from '../../lib/constants'

const initialState = new InitialState;

export default function todoReducer(state = initialState, action) {
  if (action.type === SHOW_NOTE) {
    return state
      .set('edit', false)
      .set('todo', action.payload)
  }
  else if (action.type === EDIT_NOTE) {
    return state.set('edit', true)
  }
  else if (action.type === UPDATE_NOTE) {
    return state.set('todo', action.payload)
  }
  return state;
}
