import shortid from 'shortid'
import {Actions} from 'react-native-router-flux'
import initialState from '../reducers/note/noteInitialState'
import moment from 'moment'

import { SAVE_NOTE, DELETE_NOTE, SHOW_NOTE, EDIT_NOTE, NOTES_PERSISTED, NOTES_REHYDRATED } from '../lib/constants'
import db from '../lib/db'

export function persistNotes() {
  return (dispatch, getState) => {
    const state = getState().notes
    db.saveNotes(state.toArray())
      .then(() => dispatch({type: NOTES_PERSISTED}))
      .catch((e) => console.log('Could not persist notes. error: ', e))
  }
}

export function rehydrateNotes() {
  return (dispatch) => {
    return db.getNotes()
      .then((notes) => dispatch({type: NOTES_REHYDRATED, payload: notes}))
      .catch((e) => console.log('Could not rehydrate notes. error: ', e))
  }
}

export function showNote(note) {
  return dispatch => {
    dispatch({ type: SHOW_NOTE, payload: note })
    // Actions.note()
  }
}

export function editNote(note) {
  return dispatch => {
    dispatch({ type: EDIT_NOTE, payload: note })
    // Actions.note()
  }
}

export function deleteNote(note) {
  return (dispatch) => {
    dispatch({type: DELETE_NOTE, payload: note})
    dispatch(persistNotes())
  }
}

export function newReminderNote(contact) {
  return dispatch => {
    let note = {...initialState.note}
    //prefill 
    note.id = contact.phoneNumber
    note.type = 'reminder'
    note.title = 'Geburtstagserinnerung'
    note.description = contact.name
    if (contact.registered) {
      const birthday = moment(contact.birthday, 'YYYY-MM-DD')
      const dueDate = moment(birthday) //clone
      note.dueDate = dueDate.hours(23).minute(59)
      note.description += ', ' + birthday.format('Do MMMM')
    } else  {
      note.description += ', Geb. unbekannt ;-('
    }

    dispatch(saveNote(note))
  }
}

export function saveNote(note) {
  return dispatch => {
    if (!note.id) {
      // generate
      note.id = shortid.generate()
    } 
    dispatch({type: SAVE_NOTE, payload: note})
    dispatch(persistNotes())
  }
}
