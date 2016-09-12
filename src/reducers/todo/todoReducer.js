/* @flow */

import InitialState from './todoInitialState'

import { TODO_NEW, TODO_EDIT, TODO_SHOW, TODO_UPDATE } from '../../lib/constants'

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
  else if (action.type === TODO_NEW) {
    const {contact, user} = action.payload
    let todo = {...initialState.todo}
    //prefill 
    todo.contactName = contact.name
    if (user) {
      todo.title = 'Geburtstag ' + contact.name
      todo.dueDate = user.birthday
    }
    return state
      .set('edit', true)
      .set('todo', todo)
  }
  return state;
}
