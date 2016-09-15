import shortid from 'shortid'
import {Actions} from 'react-native-router-flux'
import initialState from '../reducers/note/noteInitialState'

import { ADD_NOTE, UPDATE_NOTE, DELETE_NOTE, SHOW_NOTE, EDIT_NOTE } from '../lib/constants'

export function showNote(note) {
  return dispatch => {
    dispatch({ type: SHOW_NOTE, payload: note })
    Actions.note()
  }
}

export function editNote(note) {
  return dispatch => {
    dispatch({ type: EDIT_NOTE, payload: note })
    // Actions.note()
  }
}

export function deleteNote(note) {
  return {type: DELETE_NOTE, payload: note}
}

export function newNote(contact) {
  return dispatch => {
    let note = {...initialState.note}
    //prefill 
    note.contactName = contact.name
    note.title = 'Geburtstag ' + contact.name
    if (contact.registered) {
      note.dueDate = contact.birthday
      dispatch({type: ADD_NOTE, payload: note})
    } else {
      dispatch(editNote(note))
    }
  }
}

export function saveNote(note) {
  return dispatch => {
    if (note.id) {
      // update
      dispatch({type: UPDATE_NOTE, payload: note})
    } else {
      // add
      dispatch({type: ADD_NOTE, payload: {id: shortid.generate(), ...note}})
    }
  }
}
