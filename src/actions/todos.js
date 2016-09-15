import shortid from 'shortid'
import {Actions} from 'react-native-router-flux'
import initialState from '../reducers/todo/todoInitialState'

import { ADD_NOTE, UPDATE_NOTE, DELETE_NOTE, SHOW_NOTE, EDIT_NOTE } from '../lib/constants'

export function showTodo(todo) {
  return dispatch => {
    dispatch({ type: SHOW_NOTE, payload: todo })
    Actions.todo()
  }
}

export function editTodo(todo) {
  return dispatch => {
    dispatch({ type: EDIT_NOTE, payload: todo })
    // Actions.todo()
  }
}

export function deleteTodo(todo) {
  return {type: DELETE_NOTE, payload: todo}
}

export function newTodo(contact) {
  return dispatch => {
    let todo = {...initialState.todo}
    //prefill 
    todo.contactName = contact.name
    todo.title = 'Geburtstag ' + contact.name
    if (contact.registered) {
      todo.dueDate = contact.birthday
      dispatch({type: ADD_NOTE, payload: todo})
    } else {
      dispatch(editTodo(todo))
    }
  }
}

export function saveTodo(todo) {
  return dispatch => {
    if (todo.id) {
      // update
      dispatch({type: UPDATE_NOTE, payload: todo})
    } else {
      // add
      dispatch({type: ADD_NOTE, payload: {id: shortid.generate(), ...todo}})
    }
  }
}
