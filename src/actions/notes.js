import {Alert} from 'react-native'
import {Actions} from 'react-native-router-flux'
import Parse from 'parse/react-native'
import moment from 'moment'

import {getReminderNote, getTaskNote } from '../reducers/notes/notesReducer'

import { SHOW_NOTE, SAVE_NOTE, DELETE_NOTE, NOTES_PERSISTED, NOTES_REHYDRATED} from '../lib/constants'
import db from '../lib/db'
import {updateLocalNotifications} from '../lib/pushNotification'
import {parseDate, formatDate} from '../lib/dateUtil'
import {isIdea} from '../lib/wishUtil'
import {setBadge} from '../actions/tabs'
import {unfulfillWish, ParseWish} from '../actions/wishes'
import {setFavorite} from '../actions/contacts'

export function persistNotes() {
  return (dispatch, getState) => {
    const notes = getState().notes.toArray()
    db.saveNotes(notes)
      .then(() => dispatch({type: NOTES_PERSISTED}))
      .then(() => dispatch(updateNotesNotifications())) 
      .catch((e) => console.log('Could not persist notes. error: ', e))
  }
}

export function updateNotesNotifications() {
  return (dispatch, getState) => {
    const notes = getState().notes.toArray()
    updateLocalNotifications(notes)// No matter what the permissions are
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
    const onConfirmed = (unfulfill = false) => {
      dispatch({type: DELETE_NOTE, payload: note})
      dispatch(setFavorite(note.contact, false, false))
      dispatch(persistNotes())
      if (unfulfill) {
        dispatch(unfulfillWish(note.wish))
      }
    }
    if (note.type === 'task' && !isIdea(note.wish)) {
      Alert.alert(
        'Notiz löschen',
        `${note.contact.name}s Wunsch wird auch nach dem Löschen der Notiz immer noch von dir erfüllt.`,
        [
          {text: 'Ok', onPress: () => onConfirmed(false)},
          {text: 'Wunsch freigeben', onPress: () => onConfirmed(true)},
          {style: 'cancel', text: 'Abbrechen'},
        ]
      )
    } else {
      onConfirmed(false)

    }
  }
}

export function newTaskNote(contact, wish) {
  return (dispatch) => {
    dispatch(setBadge('notesTab'))
    dispatch(saveNote(getTaskNote(contact, wish)))
  }
}

export function newReminderNote(contact) {
  return dispatch => {
    dispatch(setBadge('notesTab'))
    dispatch(saveNote(getReminderNote(contact)))
  }
}

export function syncReminderNote(contact) {
  return dispatch => {
    if (contact.isFavorite) {
      dispatch(newReminderNote(contact))
    } else {
      dispatch({type: DELETE_NOTE, payload: {id: contact.phoneNumber}})
      dispatch(persistNotes())
    }
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
        dispatch(saveNote({id: n.id, dueDate: formatDate(due.add(1, 'year'))}, false, false))
        persist = true
      }
    })
    if (persist) {
      dispatch(persistNotes())
    }
  }
}

export function updateNoteState(note) {
  return dispatch => {
    if (note.type === 'reminder') {
      return; // Nothing to sync
    }
    new Parse.Query(ParseWish).get(note.wish.id)
      .then((parseWish) => {
        const state = parseWish.get('isPrivate') ? 'wish-deleted' : 'ok'
        dispatch(saveNote({...note, state}, false))
      })
      .catch((e) => {
        if (e.code === 101 /* Object not found. */) {
          dispatch(saveNote({...note, state: 'wish-deleted'}, false))
        }
      })
  }
}
