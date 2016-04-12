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
  
  PHONE_NUMBER,
  SEND_CODE_REQUEST,
  SEND_CODE_SUCCESS,
  SEND_CODE_FAILURE,

  VERIFICATION_CODE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  PROFILE_NAME,
  
  ON_PHONE_NUMBER_CHANGE,
  ON_FORM_FIELD_CHANGE

} from '../../lib/constants'

const initialState = new InitialState;
/**
 * ## authReducer function
 * @param {Object} state - initialState 
 * @param {Object} action - type and payload
 */
export default function authReducer(state = initialState, {type, payload}) {

  console.log('auth action', {type, payload})

  switch (type) {
    /**
     * ### Requests start
     * set the form to fetching and clear any errors
     */
  case SESSION_TOKEN_REQUEST:
  case SEND_CODE_REQUEST:
  case LOGIN_REQUEST:
    return state.set('isFetching', true)
      .set('error', null);

  case PHONE_NUMBER:
    return state.setIn(['fields', 'phoneNumber'], '')
      .set('formName', type)
      .set('error', null)

  case VERIFICATION_CODE:
    return state.setIn(['fields', 'code'], '')
      .set('formName', type)
      .set('error', null)

  case PROFILE_NAME:
    return state.setIn(['fields', 'name'], '')
      .set('formName', type)
      .set('error', null)

  case ON_PHONE_NUMBER_CHANGE: {
    return phoneNumberValidation(state, {type, payload})
  }

  case ON_FORM_FIELD_CHANGE: {
    const {field, value} = payload

    switch (field) {
    case 'birthday': {
      let formatted = (value.getMonth() + 1) + '.' + value.getDate();
      return state.setIn(['fields', field], formatted)
    }
    default:
      return state.setIn(['fields', field], value)
    }

  }

  case SESSION_TOKEN_SUCCESS:
  case SEND_CODE_SUCCESS:
  case LOGIN_SUCCESS:
    return state.set('isFetching', false)
      .set('error', null)
    

  case SESSION_TOKEN_FAILURE:
  case SEND_CODE_FAILURE:
  case LOGIN_FAILURE:
    return state.set('isFetching', false)
      .set('error', payload);
        
  }    
  /**
   * ## Default
   */
  return state;
}
