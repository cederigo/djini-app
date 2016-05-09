
import {List} from 'immutable'
import Parse from 'parse/react-native'

import {
  MY_PROFILE_LOADED,
} from '../lib/constants'

import {User, Wish} from '../lib/types'


export function loadMyProfile() {
  return dispatch => {
    Parse.Cloud.run('getMyProfile')
      .then((data) => {
        let payload: {user: User, wishes: List<Wish>} = {user: data.user, wishes: List(data.wishes)}
        dispatch({
          type: MY_PROFILE_LOADED, 
          payload: payload
        })
      })
  }
}
