/* @flow */

import {List} from 'immutable'

import type {Note} from '../../lib/types'
import {MY_PROFILE_LOADED, DELETE_NOTE, SAVE_NOTE, NOTES_REHYDRATED, SYNC_NOTE} from '../../lib/constants'

const initialState = new List

const sortByDueDate = (note) => {
  return note.dueDate ? note.dueDate : 'z'
}

export default function notesReducer(state: List<Note> = initialState, {type, payload}: any) {
  // TODO sync contacts on `CONTACTS_SUCCESS`
  if (type === MY_PROFILE_LOADED) {
    // TODO load notes from profile (back-end)?
    return state
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
