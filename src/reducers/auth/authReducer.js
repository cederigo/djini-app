/**
 * # authReducer.js
 * 
 */

import InitialState from './authInitialState'
import formValidation from './authFormValidation'

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
  
  ON_AUTH_FORM_FIELD_CHANGE

} from '../../lib/constants'

const initialState = new InitialState;
/**
 * ## authReducer function
 * @param {Object} state - initialState 
 * @param {Object} action - type and payload
 */
export default function authReducer(state = initialState, action) {

  switch (action.type) {
    /**
     * ### Requests start
     * set the form to fetching and clear any errors
     */
  case SESSION_TOKEN_REQUEST:
  case SEND_CODE_REQUEST:
  case LOGIN_REQUEST:
    return state.set('isFetching', true).set('error', null);

  case SEND_CODE_SUCCESS:
    return state.set('isFetching', false)
      .set('state', VERIFICATION_CODE)
      .set('error', null)
      .setIn(['fields', 'code'], '')

  case LOGIN_SUCCESS:
    return formValidation(
      state.set('isFetching', false)
        .set('state', PROFILE_NAME)
        .set('error',null)
        .setIn(['fields','phone'],'')
        .setIn(['fields','code'],'')
    );
    
    /**
     * ### Loggin in state
     * 
     */
  case PHONE_NUMBER:
    return formValidation(
      state.set('state', action.type)
        .set('error', null)
    );
    
    /**
     * ### Auth form field change
     *
     * Set the form's field with the value
     * Clear the forms error
     */
  case ON_AUTH_FORM_FIELD_CHANGE: {
    const {field, value} = action.payload;
    return state.setIn(['fields', field], value)
          .set('error', null);
  }
    /**
     * ### Requests end, good or bad
     * Set the fetching flag so the forms will be enabled
     */
  case SESSION_TOKEN_SUCCESS:
  case SESSION_TOKEN_FAILURE:
    return state.set('isFetching', false);

    /**
     * ### Access to Parse.com denied or failed
     * The fetching is done, but save the error
     * for display to the user
     */    
  case SEND_CODE_FAILURE:
  case LOGIN_FAILURE:
    return state.set('isFetching', false)
      .set('error', action.payload);
        
  }    
  /**
   * ## Default
   */
  return state;
}
