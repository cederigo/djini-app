import {
  FRIENDS_REQUEST,
  FRIENDS_SUCCESS,
  FRIENDS_FAILURE,

  CONTACTS_REQUEST,
  CONTACTS_SUCCESS,
  CONTACTS_FAILURE,

  SEARCH_FRIENDS
} from '../../lib/constants'

import contacts from '../../lib/contacts'
import Parse from '../../lib/Parse'
import db from '../../lib/db'

/*
 * Friends (local)
 */
export function friendsRequest() {
  return {
    type: FRIENDS_REQUEST
  }
}
export function friendsSuccess(friends) {
  return {
    type: FRIENDS_SUCCESS,
    payload: friends
  }
}
export function friendsFailure(error) {
  return {
    type: FRIENDS_FAILURE,
    payload: error
  }
}
export function getFriends() {
  return dispatch => {
    dispatch(friendsRequest())
    return db.getFriends()
      .then((friends) => dispatch(friendsSuccess(friends)))
      .catch(error => dispatch(friendsFailure(error)))
  }
}

/*
 * Contacts (Read from phonebook and enhance on server)
 */
export function contactsRequest() {
  return {
    type: CONTACTS_REQUEST
  }
}
export function contactsSuccess(friends) {
  return {
    type: CONTACTS_SUCCESS,
    payload: friends
  }
}
export function contactsFailure(error) {
  return {
    type: CONTACTS_FAILURE,
    payload: error
  }
}
/**
 * refresh Contacts
 *
 * Given our local/phonebook contact records  (name & phoneNumber)
 * contact the server and enhance each record with the following attributes:
 *  - registered (Is the contact a registered user)
 *  - birthday
 *
 *  enhanced contact records are called `friends` ;-)
 */
export function refreshContacts() {
  return (dispatch, getState) => {
    dispatch(contactsRequest())
    return contacts.getAll()
      .then((contacts) => new Parse().runCloudFunction('enhanceContacts', {contacts}))
      .then((friends) => dispatch(contactsSuccess(friends)))
      .then(() => db.saveFriends(getState().social.friends))
      .catch((error) => dispatch(contactsFailure(error)))
  }
}

export function searchFriends(text) {
  return {
    type: SEARCH_FRIENDS,
    payload: text
  }
}
