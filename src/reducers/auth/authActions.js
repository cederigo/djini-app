/**
 * # authActions.js
 * 
 * All the request actions have 3 variations, the request, a success
 * and a failure. They all follow the pattern that the request will
 * set the ```isFetching``` to true and the whether it's successful or
 * fails, setting it back to false.
 * 
 */

import {
  SESSION_TOKEN_REQUEST,
  SESSION_TOKEN_SUCCESS,
  SESSION_TOKEN_FAILURE,

  CURRENT_USER_REQUEST,
  CURRENT_USER_SUCCESS,
  CURRENT_USER_FAILURE,
  
  
  LOGIN_PHONENUMBER_FORM,
  LOGIN_VERIFICATIONCODE_FORM,
  LOGIN_PROFILE_FORM,
  LOGIN_BIRTHDAY_FORM,

  SEND_CODE_REQUEST,
  SEND_CODE_SUCCESS,
  SEND_CODE_FAILURE,

  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,

  LOGOUT,

  // PROFILE_UPDATE_REQUEST,
  // PROFILE_UPDATE_SUCCESS,
  // PROFILE_UPDATE_FAILURE,

  ON_FORM_FIELD_CHANGE

} from '../../lib/constants'

/**
 * Project requirements
 */
import Parse from '../../lib/Parse'
import db from '../../lib/db'

import {Actions} from 'react-native-router-flux'

/*
 * Show different forms
 */
export function phoneNumberForm() {
  return {type: LOGIN_PHONENUMBER_FORM}
}
export function verificationCodeForm() {
  return {type: LOGIN_VERIFICATIONCODE_FORM}
}
export function profileForm() {
  return {type: LOGIN_PROFILE_FORM}
}
export function birthdayForm() {
  return {type: LOGIN_BIRTHDAY_FORM}
}

/*
 * On form field change
 */
export function onFormFieldChange(field, value) {
  return {
    type: ON_FORM_FIELD_CHANGE,
    payload: {field, value}
  }
}

/*
 * Get session token
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
export function getSessionToken() {
  return dispatch => {
    dispatch(sessionTokenRequest());
    return db.getSessionToken()
      .then((token) => {
        if (!token) {
          dispatch(sessionTokenRequestFailure());
          return Promise.reject();
        }

        dispatch(sessionTokenRequestSuccess(token));
        return token;
      })
      .catch((error) => {
        dispatch(sessionTokenRequestFailure(error));
        return Promise.reject(error)
      });
  };
}

/*
 * Get current user
 */
export function currentUserRequest() {
  return {
    type: CURRENT_USER_REQUEST
  };
}
export function currentUserSuccess(user) {
  return {
    type: CURRENT_USER_SUCCESS,
    payload: user
  };
}
export function currentUserFailure(error) {
  return {
    type: CURRENT_USER_FAILURE,
    payload: error
  };
}
export function getCurrentUser() {
  return dispatch => {
    dispatch(currentUserRequest())
    return db.getCurrentUser()
      .then((user) => {
        if (!user) {
          return Promise.reject(new Error('current user not found'));
        }
        dispatch(currentUserSuccess(user))
        return user
      })
      .catch(error => {
        dispatch(currentUserFailure(error))
        return Promise.reject(error)
      })
  }
}

/*
 * Send Code
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
export function sendCode(phoneNumber) {
  return dispatch => {
    dispatch(sendCodeRequest())
    return new Parse().runCloudFunction('sendCode', {phoneNumber})
      .then((json) => {
        dispatch(sendCodeSuccess(json))
        dispatch(verificationCodeForm())
      })
      .catch((error) => {
        dispatch(sendCodeFailure(error))
        //start over
        dispatch(phoneNumberForm())
      });
  };
}

/*
 * Login
 */
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
export function login(phoneNumber, code, details = {}) {
  return dispatch => {
    dispatch(loginRequest())
    return new Parse().runCloudFunction('logIn', {phoneNumber, code, details})
      .then((json) => {
        //not interested in promise results
        db.saveSessionToken(json.sessionToken)
        db.saveCurrentUser(json)
        return json;
      })
      .then((json) => {
        dispatch(loginSuccess(json))
        Actions.home()
      })
      .catch((error) => {
        dispatch(loginFailure(error))
      })
  }
}

/*
 * Logout. Very simplistic (used for dev)
 */
export function logout() {
  return dispatch => {
    return Promise.all([db.deleteSessionToken(), db.deleteCurrentUser()])
      .then(() => {
        dispatch({type: LOGOUT})
        Actions.login()
      })
  }
}

/*
 * Update Profile
 */
// export function profileUpdateRequest() {
//   return {
//     type: PROFILE_UPDATE_REQUEST
//   };
// }
// export function profileUpdateSuccess(json) {
//   return {
//     type: PROFILE_UPDATE_SUCCESS,
//     payload: json
//   };
// }
// export function profileUpdateFailure(error) {
//   return {
//     type: PROFILE_UPDATE_FAILURE,
//     payload: error
//   };
// }
// export function updateProfile(data) {

//   return (dispatch, getState) => {
//     dispatch(profileUpdateRequest());
//     const {currentUser, sessionToken} = getState().global;

//     if (!(currentUser && sessionToken)) {
//       dispatch(profileUpdateFailure(new Error('Should not happen')))
//       dispatch(phoneNumberForm())
//       return;
//     }

//     return new Parse(sessionToken).updateProfile(currentUser.objectId, data)
//       .then(() => new Parse(sessionToken).getProfile())
//       .then((json) => {
//         db.saveCurrentUser(json)
//         dispatch(profileUpdateSuccess(json))
//         Actions.home()
//       })
//       .catch(error => {
//         dispatch(profileUpdateFailure(error))
//         dispatch(phoneNumberForm()) //start over
//       })
//   }
// }
