import Parse from 'parse/react-native'
import {Actions} from 'react-native-router-flux'

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

  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE,

  ON_FORM_FIELD_CHANGE
} from '../lib/constants'

import {loadMyProfile} from './profile'

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
    if (parseUser.get('email')) {
      //everything is fine
      dispatch(loadMyProfile())
      Actions.home()
    } else {
      dispatch(profileForm())
      Actions.login()
    }
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
        Actions.welcome()
      })
  }
}

/*
 * Update Profile
 */
export function profileUpdateRequest() {
  return {
    type: PROFILE_UPDATE_REQUEST
  };
}
export function profileUpdateSuccess(json) {
  return {
    type: PROFILE_UPDATE_SUCCESS,
    payload: json
  };
}
export function profileUpdateFailure(error) {
  return {
    type: PROFILE_UPDATE_FAILURE,
    payload: error
  };
}
export function updateProfile(details = {}) {
  return (dispatch) => {
    dispatch(profileUpdateRequest());
    const user = Parse.User.current()
    if (!user) {
      dispatch(profileUpdateFailure('User not logged in'))
      return
    }
    return user.save(details)
      .then((parseUser) => {
        dispatch(profileUpdateSuccess(parseUser))
      })
      .catch(error => {
        dispatch(profileUpdateFailure(error))
      })
  }
}
