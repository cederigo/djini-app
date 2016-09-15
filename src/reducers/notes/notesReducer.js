/* @flow */

import {List} from 'immutable'

import type {Note} from '../../lib/types'
import {MY_PROFILE_LOADED, DELETE_NOTE, SAVE_NOTE, NOTES_REHYDRATED } from '../../lib/constants'

const initialState = new List

const sortByDueDate = (note) => {
  return note.dueDate ? - note.dueDate.getTime() : 0
}

export default function notesReducer(state: List<Note> = initialState, {type, payload}: any) {
  if (type === MY_PROFILE_LOADED) {
    // TODO load notes from profile
    return state
  }
  else if (type === SAVE_NOTE) {
    let idx = state.findIndex((t) => t.id === payload.id)
    if (idx >= 0) {
      // update
      return state.set(idx, payload).sortBy(sortByDueDate)
    }
    // add
    return state.push(payload).sortBy(sortByDueDate)
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
