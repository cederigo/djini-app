/* @flow */

import {List} from 'immutable'
import moment from 'moment'

import type {Note} from '../../lib/types'
import {parseDate, formatDate} from '../../lib/dateUtil'
import {DELETE_NOTE, SAVE_NOTE, NOTES_REHYDRATED, UPDATE_CONTACT, CONTACTS_SUCCESS} from '../../lib/constants'

const initialState = new List

const sortByDueDate = (note) => {
  return note.dueDate ? note.dueDate : 'z'
}

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

export function getReminderNote(contact, existingNote?) {
  const existingDueDate = existingNote ? existingNote.dueDate : undefined;
  return {
    id: contact.phoneNumber,
    type: 'reminder',
    title: 'Geburtstag',
    dueDate: getDueDate(contact.birthday ? contact.birthday : existingDueDate), // use existing dueDate as fallback
    contact: {...contact} //clone
  }
}

export function getTaskNote(contact, wish) {
  return {
    id: wish.id,
    type: 'task',
    title: '',
    dueDate: getDueDate(contact.birthday),
    contact: {...contact},
    wish: {...wish}
  }
}

export default function notesReducer(state: List<Note> = initialState, {type, payload}: any) {
  if (type === UPDATE_CONTACT) {
    const contact = payload
    let idx = state.findIndex((t) => t.id === contact.phoneNumber)
    if (idx >= 0) {
      // update reminder note
      const existing = state.get(idx)
      return state.set(idx, getReminderNote(contact, existing)).sortBy(sortByDueDate)
    }
  }
  else if (type === CONTACTS_SUCCESS) {
    const contacts = payload
    return state.map((note) => {
      const contact = note.contact
      const updatedContact = contacts.get(contact.phoneNumber)
      if (updatedContact && note.type === 'reminder') {
        return getReminderNote(updatedContact)
      } else {
        return note
      }
    })
  }
  else if (type === SAVE_NOTE) {
    const {note, upsert} = payload
    let idx = state.findIndex((t) => t.id === note.id)
    if (idx >= 0) {
      // update
      const existing = state.get(idx)
      return state.set(idx, {...existing, ...note}).sortBy(sortByDueDate)
    }
    if (upsert) {
      // insert
      return state.push(note).sortBy(sortByDueDate)
    }
  }
  else if (type === DELETE_NOTE) {
    let idx = state.findIndex((t) => t.id === payload.id)
    return state.delete(idx)
  }
  else if (type === NOTES_REHYDRATED) {
    return new List(payload)
  }
  // No changes
  return state
}
