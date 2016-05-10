import Parse from 'parse/react-native'

import {
  MY_PROFILE_LOADED,
} from '../lib/constants'

export function loadMyProfile() {
  return dispatch => {
    Parse.Cloud.run('getMyProfile')
      .then(parseProfile => {
        dispatch({ type: MY_PROFILE_LOADED, payload: parseProfile})
      })
  }
}
