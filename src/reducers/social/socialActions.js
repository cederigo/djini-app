import {Map} from 'immutable';
import {Alert} from 'react-native'
import {
  FRIENDS_REQUEST,
  FRIENDS_SUCCESS,
  FRIENDS_FAILURE,

  CONTACTS_REQUEST,
  CONTACTS_SUCCESS,
  CONTACTS_FAILURE,

  SEARCH_FRIENDS,
  UPDATE_FRIENDS,
  SAVE_FRIENDS,

  INVITE_FRIEND,
  SHOW_FRIEND
} from '../../lib/constants'

import contacts from '../../lib/contacts'
import Parse from '../../lib/Parse'
import db from '../../lib/db'

/*
 * Helpers
 */
const sortFriends = function (f1, f2) {
  const now = Date.now()
  const n1 = f1.accessedAt ? (' ' + (now - f1.accessedAt) + f1.name) : f1.name
  const n2 = f2.accessedAt ? (' ' + (now - f2.accessedAt) + f2.name): f2.name
  return n1 == n2 ? 0 : (n1 < n2 ? -1 : 1)
}


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
      .then((friends) => Map(friends).sort(sortFriends))
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
  return (dispatch) => {
    dispatch(contactsRequest())
    return contacts.getAll()
      .then((contacts) => new Parse().runCloudFunction('enhanceContacts', {contacts}))
      .then((friends) => dispatch(contactsSuccess(Map(friends))))
      .then(() => dispatch(updateFriends()))
      .catch((error) => dispatch(contactsFailure(error)))
  }
}

export function updateFriends() {
  return (dispatch, getState) => {
    const state = getState().social

    const updatedFriends = state.friends.sort(sortFriends)
    dispatch({type: UPDATE_FRIENDS, payload: updatedFriends})

    //dont save to often
    if ((Date.now() - state.lastSavedAt) < 60 * 1000) {
      return;
    }

    dispatch({type: SAVE_FRIENDS, payload: Date.now()})
    db.saveFriends(updatedFriends)
      .catch(e => {
        console.log('Could not save friends. error: ', e)
      })
  }
}

export function searchFriends(text) {
  return {
    type: SEARCH_FRIENDS,
    payload: text
  }
}

export function inviteFriend(friend) {
  return dispatch => {
    const timestamp = Date.now()

    dispatch({type: INVITE_FRIEND, payload: {phoneNumber: friend.phoneNumber, timestamp}})
    //TODO: dispatch global invite activity action
    //TODO: Share dialog to invite a friend

    Alert.alert('Invite', 'Invite ' + friend.name)
    dispatch(updateFriends())
  }
}

export function showFriend(friend) {
  return dispatch => {
    const timestamp = Date.now()

    dispatch({type: SHOW_FRIEND, payload: {phoneNumber: friend.phoneNumber, timestamp}})

    //TODO: dispatch global invite activity action
    Alert.alert('Show', 'View profile of ' + friend.name)

    dispatch(updateFriends())
  }
}
