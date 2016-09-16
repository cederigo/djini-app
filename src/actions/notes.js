import {InteractionManager} from 'react-native'
import shortid from 'shortid'
import {Actions} from 'react-native-router-flux'
import initialState from '../reducers/note/noteInitialState'
import {Wish} from '../reducers/wish/wishInitialState'
import moment from 'moment'

import { SAVE_NOTE, DELETE_NOTE, NOTES_PERSISTED, NOTES_REHYDRATED } from '../lib/constants'
import {loadFriendProfile} from './contacts'
import {showWish} from './wishes'
import db from '../lib/db'

// Helpers
function getDescription(contact) {
  if (!contact.birthday) {
    // Unregistered users
    return contact.name + ', Geb. unbekannt ;-('
  } 
  const birthday = moment(contact.birthday, 'YYYY-MM-DD')
  return contact.name + ', ' + birthday.format('Do MMMM')
}

function getDueDate(contact) {
  if (!contact.birthday) {
    return undefined
  }
  return moment(contact.birthday, 'YYYY-MM-DD').hour(23).minute(59)
}

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
    // TODO show note view ?
    // TODO check if dueDate is missing and make the user enter it
    Actions.contacts({type: 'reset', duration: 0})
    InteractionManager.runAfterInteractions(() => {
      dispatch(loadFriendProfile(note.contact))
        .then(() => {
          if (note.type === 'task') {
            dispatch(showWish(new Wish(note.wish), 'friend', note.contact))
          }
        })
    })
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
    note.description = getDescription(contact)
    note.contact = {...contact}
    note.wish = {...wish}
    note.dueDate = getDueDate(contact)
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
    note.description = getDescription(contact)
    note.contact = {...contact} //clone
    note.dueDate = getDueDate(contact)
    dispatch(saveNote(note))
  }
}

export function saveNote(note, upsert = true) {
  return dispatch => {
    if (!note.id) {
      // generate
      note.id = shortid.generate()
    } 
    dispatch({type: SAVE_NOTE, payload: {note, upsert}})
    dispatch(persistNotes())
  }
}
