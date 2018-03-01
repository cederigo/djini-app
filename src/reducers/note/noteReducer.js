/* @flow */

import { Record } from 'immutable'

import type { Note } from '../../lib/types'
import NoteRecord from './noteInitialState'

import { SHOW_NOTE, SAVE_NOTE } from '../../lib/constants'

const initialState = new NoteRecord()

export default function noteReducer(state: Record<Note> = initialState, action: any) {
  if (action.type === SAVE_NOTE) {
    return new NoteRecord(action.payload.note)
  } else if (action.type === SHOW_NOTE) {
    return new NoteRecord(action.payload)
  }
  return state
}
