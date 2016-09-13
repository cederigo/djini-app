import {List} from 'immutable'

import {MY_PROFILE_LOADED, TODO_DELETE, TODO_ADD, TODO_UPDATE } from '../../lib/constants'

const initialState = new List

export default function todosReducer(state = initialState, {type, payload}) {
  if (type === MY_PROFILE_LOADED) {
    // TODO load todos from profile
    return state
  }
  else if (type === TODO_ADD) {
    return state.push(payload).sortBy(todo => -todo.dueDate.getTime())
  }
  else if (type === TODO_UPDATE) {
    let idx = state.findIndex((t) => t.id === payload.id)
    if (idx >= 0) {
      return state.set(idx, payload).sortBy(todo => -todo.dueDate.getTime())
    }
  }
  else if (type === TODO_DELETE) {
    let idx = state.findIndex((t) => t.id === payload.id)
    return state.delete(idx)
  }
  // No changes
  return state
}
