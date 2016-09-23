/**
 * # reducers
 * 
 * This class combines all the reducers into one
 * 
 */

import global from './global/globalReducer'
import auth from './auth/authReducer'
import wish from './wish/wishReducer'
import contacts from './contacts/contactsReducer'
import friend from './friend/friendReducer'
import wishes from './wishes/wishesReducer'
import profile from './profile/profileReducer'
import feedback from './feedback/feedbackReducer'
import notes from './notes/notesReducer'
import note from './note/noteReducer'

import { combineReducers } from 'redux'

/**
 * ## CombineReducers
 * 
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */ 
const rootReducer = combineReducers({
  global,
  auth,
  wish,
  contacts,
  friend,
  wishes,
  profile,
  feedback,
  notes,
  note
})

export default rootReducer
