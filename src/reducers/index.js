/**
 * # reducers
 * 
 * This class combines all the reducers into one
 * 
 */

import global from './global/globalReducer';
import device from './device/deviceReducer';
import auth from './auth/authReducer';
import social from './social/socialReducer';

import { combineReducers } from 'redux';

/**
 * ## CombineReducers
 * 
 * the rootReducer will call each and every reducer with the state and action
 * EVERY TIME there is a basic action
 */ 
const rootReducer = combineReducers({
  global,
  device,
  auth,
  social
});

export default rootReducer;
