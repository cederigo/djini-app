import shortid from 'shortid'
import {Actions} from 'react-native-router-flux'
import initialState from '../reducers/todo/todoInitialState'

import { TODO_ADD, TODO_UPDATE, TODO_DELETE, TODO_SHOW, TODO_EDIT } from '../lib/constants'

export function showTodo(todo) {
  return dispatch => {
    dispatch({ type: TODO_SHOW, payload: todo })
    Actions.todo()
  }
}

export function editTodo(todo) {
  return dispatch => {
    dispatch({ type: TODO_EDIT, payload: todo })
    // Actions.todo()
  }
}

export function deleteTodo(todo) {
  return {type: TODO_DELETE, payload: todo}
}

export function newTodo(contact) {
  return dispatch => {
    let todo = {...initialState.todo}
    //prefill 
    todo.contactName = contact.name
    todo.title = 'Geburtstag ' + contact.name
    if (contact.registered) {
      todo.dueDate = contact.birthday
      dispatch({type: TODO_ADD, payload: todo})
    } else {
      dispatch(editTodo(todo))
    }
  }
}

export function saveTodo(todo) {
  return dispatch => {
    if (todo.id) {
      // update
      dispatch({type: TODO_UPDATE, payload: todo})
    } else {
      // add
      dispatch({type: TODO_ADD, payload: {id: shortid.generate(), ...todo}})
    }
  }
}
