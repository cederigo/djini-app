/* @flow */

import InitialState from './todoInitialState'

import { TODO_EDIT, TODO_SHOW, TODO_UPDATE } from '../../lib/constants'

const initialState = new InitialState;

export default function todoReducer(state = initialState, action) {
  if (action.type === TODO_SHOW) {
    return state
      .set('edit', false)
      .set('todo', action.payload)
  }
  else if (action.type === TODO_EDIT) {
    return state.set('edit', true)
  }
  else if (action.type === TODO_UPDATE) {
    return state.set('todo', action.payload)
  }
  return state;
}
