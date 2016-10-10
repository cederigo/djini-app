/* @flow */

import {List} from 'immutable'
import moment from 'moment'

import type {Note} from '../../lib/types'
import {parseDate, formatDate} from '../../lib/dateUtil'
import {DELETE_NOTE, SAVE_NOTE, NOTES_REHYDRATED, UPDATE_CONTACT} from '../../lib/constants'

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

export function getReminderNote(contact) {
  return {
    id: contact.phoneNumber,
    type: 'reminder',
    title: 'Geburtstag',
    dueDate: getDueDate(contact.birthday),
    contact: {...contact} //clone
  }
}

export function getTaskNote(contact, wish) {
  return {
    id: wish.id,
    type: 'task',
    title: 'Geburtstag',
    dueDate: getDueDate(contact.birthday),
    contact: {...contact},
    wish: {...wish}
  }
}

export default function notesReducer(state: List<Note> = initialState, {type, payload}: any) {
  // TODO sync contacts on `CONTACTS_SUCCESS`
  if (type === UPDATE_CONTACT) {
    const contact = payload
    let idx = state.findIndex((t) => t.id === contact.phoneNumber)
    // const existing = state.get(idx)
    if (idx >= 0) {
      return state.set(idx, getReminderNote(contact)).sortBy(sortByDueDate)
    }
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
