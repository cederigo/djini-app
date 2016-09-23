import {Actions} from 'react-native-router-flux'
import initialState from '../reducers/note/noteInitialState'
import moment from 'moment'

import { SHOW_NOTE, SAVE_NOTE, DELETE_NOTE, NOTES_PERSISTED, NOTES_REHYDRATED } from '../lib/constants'
import db from '../lib/db'
import {cancelAllLocalNotifications, scheduleLocalNotifications, getLocalNotifications} from '../lib/pushNotification'
import {setBadge} from '../actions/tabs'

function getDueDate(birthday) {
  if (!birthday) {
    return undefined
  }
  const now = moment()
  const dueDate = moment(birthday, 'YYYY-MM-DD').year(now.year())
  if (dueDate.isBefore(now)) {
    dueDate.add(1, 'year')
  }
  return dueDate.format('YYYY-MM-DD')
}

function updateLocalNotifications(notes) {
  cancelAllLocalNotifications()
  scheduleLocalNotifications(getLocalNotifications(notes))
}

export function persistNotes() {
  return (dispatch, getState) => {
    const notes = getState().notes.toArray()
    db.saveNotes(notes)
      .then(() => dispatch({type: NOTES_PERSISTED}))
      .then(() => updateLocalNotifications(notes))
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
  return (dispatch) => {
    dispatch({type: SHOW_NOTE, payload: note})
    Actions.note({edit: false})
  }
}

export function deleteNote(note) {
  return (dispatch) => {
    dispatch({type: DELETE_NOTE, payload: note})
    dispatch(persistNotes())
  }
}

export function newTaskNote(contact, wish) {
  return (dispatch) => {
    let note = {...initialState.note}
    note.id = wish.id
    note.type = 'task'
    note.title = wish.title
    note.dueDate = getDueDate(contact.birthday)
    note.contact = {...contact}
    note.wish = {...wish}
    dispatch(setBadge('notesTab'))
    dispatch(saveNote(note))
  }
}

export function updateTaskNote(wish) {
  return (dispatch) => {
    let note = {...initialState.note}
    note.id = wish.id
    note.wish = {...wish}
    dispatch(saveNote(note, false))
  }
}

export function newReminderNote(contact) {
  return dispatch => {
    let note = {...initialState.note} //clone
    //prefill 
    note.id = contact.phoneNumber
    note.type = 'reminder'
    note.title = 'Geburtstagserinnerung'
    note.dueDate = getDueDate(contact.birthday)
    note.contact = {...contact} //clone
    dispatch(setBadge('notesTab'))
    dispatch(saveNote(note))
  }
}

export function saveNote(note, upsert = true) {
  return dispatch => {
    if (!note.id) {
      throw new Error('Note has no `id` ', note)
    } 
    dispatch({type: SAVE_NOTE, payload: {note, upsert}})
    dispatch(persistNotes())
  }
}
