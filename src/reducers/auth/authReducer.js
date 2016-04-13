/**
 * # authReducer.js
 * 
 */

import InitialState from './authInitialState'
import {phoneNumberValidation} from '../../lib/phoneUtil'


/**
 * ## Auth actions
 */
import {
  SESSION_TOKEN_REQUEST,
  SESSION_TOKEN_SUCCESS,
  SESSION_TOKEN_FAILURE,
  
  LOGIN_PHONENUMBER_FORM,
  SEND_CODE_REQUEST,
  SEND_CODE_SUCCESS,
  SEND_CODE_FAILURE,

  LOGIN_VERIFICATIONCODE_FORM,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE,

  LOGIN_PROFILE_FORM,
  
  ON_FORM_FIELD_CHANGE

} from '../../lib/constants'

const initialState = new InitialState;
/**
 * ## authReducer function
 * @param {Object} state - initialState 
 * @param {Object} action - type and payload
 */
export default function authReducer(state = initialState, {type, payload}) {

  switch (type) {
    /**
     * ### Requests start
     * set the form to fetching and clear any errors
     */
  case SESSION_TOKEN_REQUEST:
  case SEND_CODE_REQUEST:
  case LOGIN_REQUEST:
  case PROFILE_UPDATE_REQUEST:
    return state.set('isFetching', true)
      .set('error', null);

  case LOGIN_PHONENUMBER_FORM:
    return state.setIn(['fields', 'phoneNumber'], '')
      .set('isValid', false)
      .set('formName', type)
      .set('error', null)

  case LOGIN_VERIFICATIONCODE_FORM:
    return state.setIn(['fields', 'code'], '')
      .set('isValid', false)
      .set('formName', type)
      .set('error', null)

  case LOGIN_PROFILE_FORM:
    return state.setIn(['fields', 'name'], '')
      .set('isValid', false)
      .set('formName', type)
      .set('error', null)

  case ON_FORM_FIELD_CHANGE: {
    const {field, value} = payload

    state = state.set('error', null)

    switch (field) {
    case 'phoneNumber': 
      return phoneNumberValidation(state, {type, payload})
    case 'code':
    case 'name':
      return state.setIn(['fields', field], value)
        .set('isValid', value.length ? true : false)
    case 'birthday': {
      let formatted = value.getYear() + '/' + (value.getMonth() + 1) + '/' + value.getDate();
      return state.setIn(['fields', field], formatted)
    }
    default:
      return state
    }

  }

  case SESSION_TOKEN_SUCCESS:
  case SEND_CODE_SUCCESS:
  case LOGIN_SUCCESS:
  case PROFILE_UPDATE_SUCCESS:
    return state.set('isFetching', false)
      .set('error', null)
    

  case SESSION_TOKEN_FAILURE:
  case SEND_CODE_FAILURE:
  case LOGIN_FAILURE:
  case PROFILE_UPDATE_FAILURE:
    return state.set('isFetching', false)
      .set('error', payload);
        
  }    
  /**
   * ## Default
   */
  return state;
}
