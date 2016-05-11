import {OrderedMap} from 'immutable';
import {ActionSheetIOS, Platform} from 'react-native'
import Share from 'react-native-share';
import {Actions} from 'react-native-router-flux'

import {
  RESTORE_CONTACTS_REQUEST,
  RESTORE_CONTACTS_SUCCESS,
  RESTORE_CONTACTS_FAILURE,

  CONTACTS_REQUEST,
  CONTACTS_SUCCESS,
  CONTACTS_FAILURE,

  GET_FRIEND_PROFILE_REQUEST,
  GET_FRIEND_PROFILE_SUCCESS,
  GET_FRIEND_PROFILE_FAILURE,

  ON_SEARCH_FIELD_CHANGE,
  SAVE_CONTACTS,

  TOGGLE_FAVORITE  
} from '../lib/constants'

import contacts from '../lib/contacts'
import Parse from 'parse/react-native'
import db from '../lib/db'

/*
 * Restore contacts
 */
export function restoreContactsRequest() {
  return {
    type: RESTORE_CONTACTS_REQUEST
  }
}
export function restoreContactsSuccess(contacts) {
  return {
    type: RESTORE_CONTACTS_SUCCESS,
    payload: contacts
  }
}
export function restoreContactsFailure(error) {
  return {
    type: RESTORE_CONTACTS_FAILURE,
    payload: error
  }
}
export function restoreContacts() {
  return dispatch => {
    dispatch(restoreContactsRequest())
    return db.getContacts()
      .then((contacts) => dispatch(restoreContactsSuccess(contacts)))
      .catch(error => dispatch(restoreContactsFailure(error)))
  }
}

/*
 * Contacts (Read from phonebook and merge with users on server)
 */
export function contactsRequest() {
  return {
    type: CONTACTS_REQUEST
  }
}
export function contactsSuccess(contacts) {
  return {
    type: CONTACTS_SUCCESS,
    payload: contacts
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
 * Read local contacts from phonebook (name & phoneNumber)
 * and merge with users on server.
 *
 * For each matching <contact, user> pair the server adds these attributes:
 *  - id 
 *  - birthday
 */
export function refreshContacts() {
  return (dispatch) => {
    dispatch(contactsRequest())
    return contacts.getAll()
      .then((contacts) => Parse.Cloud.run('mergeWithUsers', {contacts}))
      .then((contacts) => OrderedMap(contacts).sortBy(f => f.name))
      .then((contacts) => dispatch(contactsSuccess(contacts)))
      .then(() => dispatch(saveContacts()))
      .catch((error) => dispatch(contactsFailure(error)))
  }
}

export function saveContacts() {
  return (dispatch, getState) => {
    const state = getState().contacts
    dispatch({type: SAVE_CONTACTS, payload: Date.now()})
    db.saveContacts(state.contacts.entrySeq())
      .catch(e => {
        console.log('Could not save state. error: ', e)
      })
  }
}

export function onSearchFieldChange(text) {
  return {
    type: ON_SEARCH_FIELD_CHANGE,
    payload: text
  }
}

export function toggleFavorite(contact) {
  return dispatch => {
    dispatch({type: TOGGLE_FAVORITE, payload: contact})
    dispatch(saveContacts())
  }
}

export function invite(contact) {
  return dispatch => {
    const url = 'https://tsfr.io/j9n6rp'
    const message = 'Ich möchte dir etwas schenken, weis aber nicht was...';
    //TODO: dispatch global invite activity action (to server too)
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showShareActionSheetWithOptions(
        {message, url},
        () => console.log('show share success'),
        (e) => console.log('show share error: ', e)
      );
    } else {
      Share.open({
        share_text: message,
        share_URL: url,
        title: 'Wishmaster Einladung',
      }, (e) => console.log(e))
    }
  }
}


/*
* Get Friend profile
*/
function getFriendProfileRequest() {
  return {
    type: GET_FRIEND_PROFILE_REQUEST
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

export function loadFriendProfile(contact) {
  return dispatch => {
    dispatch(getFriendProfileRequest())
    Parse.Cloud.run('getFriendProfile', {phoneNumber: contact.phoneNumber})
      .then((profile) => {
        dispatch(getFriendProfileSuccess({profile, contact}))
        Actions.friend()
      })
      .catch(error => {
        dispatch(getFriendProfileFailure(error))
      })
  }
}