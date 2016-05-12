import Parse from 'parse/react-native'

import {
  MY_PROFILE_REQUEST,
  MY_PROFILE_FAILURE,
  MY_PROFILE_LOADED,
} from '../lib/constants'

export function loadMyProfile() {
  return dispatch => {
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
