/**
 * # reducers
 * 
 * This class combines all the reducers into one
 * 
 */

import global from './global/globalReducer'
import auth from './auth/authReducer'
import wish from './wish/wishReducer'
import social from './social/socialReducer'
import friend from './friend/friendReducer'
import wishes from './wishes/wishesReducer'

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
  social,
  friend,
  wishes
})

export default rootReducer
