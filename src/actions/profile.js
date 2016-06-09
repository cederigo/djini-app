import Parse from 'parse/react-native'
import {Actions} from 'react-native-router-flux'

import {User} from '../lib/types'


import {
  MY_PROFILE_REQUEST,
  MY_PROFILE_FAILURE,
  MY_PROFILE_LOADED,
  EDIT_PROFILE,

  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE,
} from '../lib/constants'

export function loadMyProfile() {
  return (dispatch) => {
    dispatch({type: MY_PROFILE_REQUEST})
    Parse.Cloud.run('getMyProfile')
      .then(parseProfile => {
        dispatch({ type: MY_PROFILE_LOADED, payload: parseProfile})
      })
      .catch((error) => {
        dispatch({type: MY_PROFILE_FAILURE, payload: error})
      })
  }
}

export function editProfile(currentUser: User) {
  return (dispatch) => {
    dispatch({type: EDIT_PROFILE, payload: currentUser})
    Actions.profileEdit()
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
