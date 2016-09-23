import {InteractionManager} from 'react-native'
import Parse from 'parse/react-native'
import {Actions} from 'react-native-router-flux'

import {User} from '../lib/types'
import {findWishInProfile} from '../reducers/profile/profileReducer'
import {showWish} from './wishes'

import {
  MY_PROFILE_REQUEST,
  MY_PROFILE_FAILURE,
  MY_PROFILE_LOADED,
  EDIT_PROFILE,
  CANCEL_EDIT_PROFILE,

  PROFILE_UPDATE_REQUEST,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_FAILURE,

  GET_FRIEND_PROFILE_REQUEST,
  GET_FRIEND_PROFILE_SUCCESS,
  GET_FRIEND_PROFILE_FAILURE,

  ON_PROFILE_FIELD_CHANGE
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

/*
* Get Friend profile
*/
function getFriendProfileRequest(contact) {
  return {
    type: GET_FRIEND_PROFILE_REQUEST,
    payload: contact
  }
}

function getFriendProfileSuccess(friendProfile) {
  return {
    type: GET_FRIEND_PROFILE_SUCCESS,
    payload: friendProfile
  }
}

function getFriendProfileFailure(error) {
  return {
    type: GET_FRIEND_PROFILE_FAILURE,
    payload: error
  }
}

export function loadFriendProfile(contact, wishId) {
  return (dispatch, getState) => {

    const me = getState().global.currentUser

    if (contact.phoneNumber === me.phoneNumber) {
      return Promise.reject(new Error('Not allowed to load own profile'));   
    }

    dispatch(getFriendProfileRequest(contact))
    Actions.friend()
    return Parse.Cloud.run('getFriendProfile', {phoneNumber: contact.phoneNumber})
      .then((profile) => {
        InteractionManager.runAfterInteractions(() => {
          const contacts = getState().contacts.contacts
          dispatch(getFriendProfileSuccess({profile, contacts}))
          if (wishId) {
            const wish = findWishInProfile(getState().friend, wishId)
            if (wish) {
              dispatch(showWish(wish, 'friend', contact))
            }
          }
        })
      })
      .catch(error => {
        dispatch(getFriendProfileFailure(error))
      })
  }
}

export function editProfile(currentUser: User) {
  return (dispatch) => {
    dispatch({type: EDIT_PROFILE, payload: currentUser})
  }
}

export function cancelEditProfile() {
  return (dispatch) => {
    dispatch({type: CANCEL_EDIT_PROFILE})
  }
}

export function onFieldChange(field, value) {
  return {type: ON_PROFILE_FIELD_CHANGE, payload: {field, value}}
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
export function updateProfile(details = {}, source="login") {
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
        if (source === 'profile-edit') {
          Actions.pop()
        }
      })
      .catch(error => {
        dispatch(profileUpdateFailure(error))
      })
  }
}
