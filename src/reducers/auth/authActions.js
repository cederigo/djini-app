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
  VERIFICATION_CODE,
  PROFILE_NAME,

  SEND_CODE_REQUEST,
  SEND_CODE_SUCCESS,
  SEND_CODE_FAILURE,

  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  ON_PHONE_NUMBER_CHANGE,
  ON_FORM_FIELD_CHANGE

} from '../../lib/constants'

/**
 * Project requirements
 */
import Parse from '../../lib/Parse'

import {Actions} from 'react-native-router-flux'

//TODO Store
//import AppAuthToken from '../../lib/AppAuthToken'

export function phoneNumber() {
  return {
    type: PHONE_NUMBER
  };
}

export function verificationCode() {
  return {
    type: VERIFICATION_CODE
  }
}

export function profileName() {
  return {
    type: PROFILE_NAME
  }
}


export function onPhoneNumberChange(text) {
  return {
    type: ON_PHONE_NUMBER_CHANGE,
    payload: text
  };
}

export function onFormFieldChange(field, value) {
  return {
    type: ON_FORM_FIELD_CHANGE,
    payload: {field, value}
  }
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
          dispatch(phoneNumber());
          Actions.login();
        }
      })
    
      .catch((error) => {
        dispatch(sessionTokenRequestFailure(error));
        dispatch(profileName());
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
export function sendCode(phoneNumber) {
  return dispatch => {
    dispatch(sendCodeRequest())
    return new Parse().runCloudFunction('sendCode', {phoneNumber})
      .then((json) => {
        dispatch(sendCodeSuccess(json))
        dispatch(verificationCode())
      })
      .catch((error) => {
        dispatch(sendCodeFailure(error))
      });
  };
}

export function loginRequest() {
  return {
    type: LOGIN_REQUEST
  };
}

export function loginSuccess(json) {
  return {
    type: LOGIN_SUCCESS,
    payload: json
  };
}

export function loginFailure(error) {
  return {
    type: LOGIN_FAILURE,
    payload: error
  };
}

export function login(phoneNumber, code) {
  return dispatch => {
    dispatch(loginRequest())
    return new Parse().runCloudFunction('logIn', {phoneNumber, code})
      .then((json) => {
        dispatch(loginSuccess(json))
        dispatch(profileName())
      })
      .catch((error) => {
        dispatch(loginFailure(error))
      })
  }
}
