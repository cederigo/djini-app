import {Alert} from 'react-native'
import {Actions} from 'react-native-router-flux'
import initialState from '../reducers/note/noteInitialState'
import moment from 'moment'

import { SHOW_NOTE, SAVE_NOTE, DELETE_NOTE, NOTES_PERSISTED, NOTES_REHYDRATED, DEFER_PAST_NOTE } from '../lib/constants'
import db from '../lib/db'
import {updateLocalNotifications} from '../lib/pushNotification'
import {parseDate, formatDate} from '../lib/dateUtil'
import {isIdea} from '../lib/wishUtil'
import {setBadge} from '../actions/tabs'
import {unfulfillWish} from '../actions/wishes'

function getDueDate(birthday) {
  if (!birthday) {
    return undefined
  }
  const now = moment()
  const dueDate = parseDate(birthday).year(now.year())
  if (dueDate.isBefore(now)) {
    dueDate.add(1, 'year')
  }
  return formatDate(dueDate)
}

export function persistNotes() {
  return (dispatch, getState) => {
    const notes = getState().notes.toArray()
    db.saveNotes(notes)
      .then(() => dispatch({type: NOTES_PERSISTED}))
      .then(() => updateLocalNotifications(notes)) // No matter what the permissions are
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
    if (note.type === 'task' && !isIdea(note.wish)) {
      Alert.alert(
        'Djini sagt:',
        `${note.contact.name}s Wunsch wird immer noch von dir erfüllt.`,
        [
          {style: 'cancel', text: 'Ok'},
          {text: 'Freigeben', onPress: () => dispatch(unfulfillWish(note.wish))}
        ]
      )
    }
  }
}

export function getTaskNote(contact, wish) {
  let note = {...initialState.note}
  note.id = wish.id
  note.type = 'task'
  note.title = 'Geburtstag'
  note.dueDate = getDueDate(contact.birthday)
  note.contact = {...contact}
  note.wish = {...wish}
  return note
}

export function newTaskNote(contact, wish) {
  return (dispatch) => {
    dispatch(setBadge('notesTab'))
    dispatch(saveNote(getTaskNote(contact, wish)))
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

export function saveNote(note, upsert = true, persist = true) {
  return dispatch => {
    if (!note.id) {
      throw new Error('Note has no `id` ', note)
    } 
    dispatch({type: SAVE_NOTE, payload: {note, upsert}})
    if (persist) {
      dispatch(persistNotes())
    }
  }
}

export function deferPastNotes(notes) {
  let persist = false
  const now = moment()
  const isPast = (due) => {
    return now.diff(due, 'days') > 0
  }
  return (dispatch) => {
    const reminders = notes.filter((n) => n.type === 'reminder')
    reminders.forEach((n) => {
      const due = parseDate(n.dueDate)
      if (isPast(due)) {
        dispatch(saveNote({dueDate: formatDate(due.add(1, 'year'))}, false, false))
        persist = true
      }
    })
    if (persist) {
      dispatch(persistNotes())
    }
  }
}
