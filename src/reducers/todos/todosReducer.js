import {List} from 'immutable'

import {MY_PROFILE_LOADED, DELETE_NOTE, ADD_NOTE, UPDATE_NOTE } from '../../lib/constants'

const initialState = new List

export default function todosReducer(state = initialState, {type, payload}) {
  if (type === MY_PROFILE_LOADED) {
    // TODO load todos from profile
    return state
  }
  else if (type === ADD_NOTE) {
    return state.push(payload).sortBy(todo => -todo.dueDate.getTime())
  }
  else if (type === UPDATE_NOTE) {
    let idx = state.findIndex((t) => t.id === payload.id)
    if (idx >= 0) {
      return state.set(idx, payload).sortBy(todo => -todo.dueDate.getTime())
    }
  }
  else if (type === DELETE_NOTE) {
    let idx = state.findIndex((t) => t.id === payload.id)
    return state.delete(idx)
  }
  // No changes
  return state
}
