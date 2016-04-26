import {
  
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

} from '../lib/constants'

/**
 * Project requirements
 */
import Parse from 'parse/react-native'

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
    Parse.Cloud.run('sendCode', {phoneNumber})
      .then(() => {
        dispatch(sendCodeSuccess())
        dispatch(verificationCodeForm())
      })
      .catch((error) => {
        dispatch(sendCodeFailure(error))
      })
  }
}

/*
 * Login
 */
export function loginRequest() {
  return {
    type: LOGIN_REQUEST
  };
}
export function loginSuccess(parseUser) {
  return (dispatch) => {
    dispatch({ type: LOGIN_SUCCESS, payload: parseUser })
    Actions.home()
  } 
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
    return Parse.Cloud.run('logIn', {phoneNumber, code, details})
      .then(parseUser => Parse.User.become(parseUser.getSessionToken()))
      .then(parseUser => dispatch(loginSuccess(parseUser)))
      .catch(error => dispatch(loginFailure(error)))
  }
}

/*
 * Logout.
 */
export function logout() {
  return dispatch => {
    Parse.User.logOut()
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
