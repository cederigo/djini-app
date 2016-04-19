import {
  SYNC_FRIENDS_REQUEST,
  SYNC_FRIENDS_SUCCESS,
  SYNC_FRIENDS_FAILURE
} from '../../lib/constants'

import contacts from '../../lib/contacts'
import Parse from '../../lib/Parse'


/*
 * Sync Friends
 */
export function syncFriendsRequest() {
  return {
    type: SYNC_FRIENDS_REQUEST
  }
}
export function syncFriendsSuccess(friends) {
  return {
    type: SYNC_FRIENDS_SUCCESS,
    payload: friends
  }
}
export function syncFriendsFailure(error) {
  return {
    type: SYNC_FRIENDS_FAILURE,
    payload: error
  }
}

/**
 * HELPER
 *
 * Given our local/phonebook contact records  (name & phoneNumber)
 * contact the server and enhance each record with the following attributes:
 *  - registered (Is the contact a registered user)
 *  - birthday
 *
 *  enhanced contact records are called `friends` ;-)
 */
function enhanceContacts(contacts) {
  return new Parse().runCloudFunction('enhanceContacts', {contacts})
}

export function syncFriends() {
  return dispatch => {
    dispatch(syncFriendsRequest())
    return contacts.getAll()
      .then((contacts) => enhanceContacts(contacts))
      .then((friends) => dispatch(syncFriendsSuccess(friends)))
      .catch((error) => dispatch(syncFriendsFailure(error)))
  }
}
