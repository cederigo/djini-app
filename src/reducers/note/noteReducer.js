/* @flow */

import InitialState from './noteInitialState'

import { EDIT_NOTE, SHOW_NOTE, SAVE_NOTE } from '../../lib/constants'

const initialState = new InitialState;

export default function noteReducer(state: any = initialState, action: any) {
  if (action.type === SHOW_NOTE) {
    return state
      .set('edit', false)
      .set('note', action.payload)
  }
  else if (action.type === EDIT_NOTE) {
    return state.set('edit', true)
  }
  else if (action.type === SAVE_NOTE) {
    return state.set('note', action.payload)
  }
  return state;
}
