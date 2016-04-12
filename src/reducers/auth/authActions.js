/**
 * # authActions.js
 * 
 * All the request actions have 3 variations, the request, a success
 * and a failure. They all follow the pattern that the request will
 * set the ```isFetching``` to true and the whether it's successful or
 * fails, setting it back to false.
 * 
 */

/**
 * ## Imports
 * 
 * The actions supported
 */
import {
  SESSION_TOKEN_REQUEST,
  SESSION_TOKEN_SUCCESS,
  SESSION_TOKEN_FAILURE,
  
  PHONE_NUMBER,

  SEND_CODE_REQUEST,
  SEND_CODE_SUCCESS,
  SEND_CODE_FAILURE,

  ON_PHONE_NUMBER_CHANGE

} from '../../lib/constants'

/**
 * Project requirements
 */
import Parse from '../../lib/Parse'

import {Actions} from 'react-native-router-flux'

//TODO Store
//import AppAuthToken from '../../lib/AppAuthToken'

/**
 * ## State actions
 * controls which form is displayed to the user
 */

export function phoneNumberState() {
  return {
    type: PHONE_NUMBER
  };
}


export function onPhoneNumberChange(text) {
  return {
    type: ON_PHONE_NUMBER_CHANGE,
    payload: text
  };
}

/**
 * ## SessionToken actions
 */
export function sessionTokenRequest() {
  return {
    type: SESSION_TOKEN_REQUEST
  };
}
export function sessionTokenRequestSuccess(token) {
  return {
    type: SESSION_TOKEN_SUCCESS,
    payload: token
  };
}
export function sessionTokenRequestFailure(error) {
  return {
    type: SESSION_TOKEN_FAILURE,
    payload: error
  };
}

/**
 * ## Token
 * If AppAuthToken has the sessionToken, the user is logged in
 * Otherwise, the user will default to the login in screen.
 */
export function getSessionToken() {
  return dispatch => {
    dispatch(sessionTokenRequest());
    //TODO get session token from store
    //return new AppAuthToken().getSessionToken()
    return Promise.reject(new Error('not implemented yet'))

      .then((token) => {
        if (token) {
          dispatch(sessionTokenRequestSuccess(token));
          //TODO home
          //Actions.home();
        } else {
          dispatch(sessionTokenRequestFailure());
          Actions.login();
        }
      })
    
      .catch((error) => {
        dispatch(sessionTokenRequestFailure(error));
        dispatch(phoneNumberState());
        Actions.login();
      });
  };
}

/**
 * ## saveSessionToken
 * @param {Object} response - to return to keep the promise chain
 * @param {Object} json - object with sessionToken
 */
export function saveSessionToken(json) {
  return new AppAuthToken().storeSessionToken(json)
    .then(() => json)
}

/**
 * ## Login actions
 */
export function sendCodeRequest() {
  return {
    type: SEND_CODE_REQUEST
  };
}

export function sendCodeSuccess(json) {
  return {
    type: SEND_CODE_SUCCESS,
    payload: json
  };
}

export function sendCodeFailure(error) {
  return {
    type: SEND_CODE_FAILURE,
    payload: error
  };
}

/**
 * ## Send Code
 * @param {string} phonenumber - user's phonenumber
 *
 * If successful, set the state to login
 * otherwise, dispatch a failure
 */
export function sendCode(phonenumber) {
  return dispatch => {
    dispatch(sendCodeRequest());
    //TODO: cloud function sendCode
    return new Parse().signup({ username: phonenumber, password: '' })
      .then((json) => {
        dispatch(sendCodeSuccess(json));
        Actions.loginVerificationCode();
      })
      .catch((error) => {
        dispatch(sendCodeFailure(error));
      });
  };
}

export function login(phoneNumber, verificationCode) {
  return () => {
    console.log('TODO: login ', phoneNumber, verificationCode);
    //TODO
    Actions.loginProfile();
  }
}
