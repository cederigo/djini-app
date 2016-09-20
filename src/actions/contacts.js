import {OrderedMap} from 'immutable';
import {Platform, Linking, InteractionManager} from 'react-native'
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

  TOGGLE_FAVORITE,
  INVITE_CONTACT
} from '../lib/constants'

import {newReminderNote} from './notes'
import Contacts from '../lib/contacts'
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
 */
export function refreshContacts(source: ?string = 'app') {
  return (dispatch, getState) => {
    if (source === 'app' && getState().contacts.pristine) {
      //Don't try to access contacts on app startup when state is pristine.
      //We want the user to actively trigger the permission dialog
      return;
    }
    dispatch(contactsRequest())
    return Contacts.getAll()
      .then((contacts) => Parse.Cloud.run('mergeWithUsers', {contacts}))
      .then((contacts) => Contacts.transliterate(contacts))
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
    if (!contact.isFavorite) {
      dispatch(newReminderNote({...contact, isFavorite: true}))
    }
    dispatch(saveContacts())
  }
}

export function invite(contact) {
  return dispatch => {
    dispatch({type: INVITE_CONTACT})
    const url = 'https://tsfr.io/j9n6rp'
    const message = 'Ich möchte dir etwas schenken, weis aber nicht was...' + url;
    //see: http://stackoverflow.com/questions/6480462/how-to-pre-populate-the-sms-body-text-via-an-html-link
    if (Platform.OS === 'ios') {
      // &
      Linking.openURL(`sms:${contact.phoneNumber}&body=${message}`)
    } else {
      // ?
      Linking.openURL(`sms:${contact.phoneNumber}?body=${message}`)
    }
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

export function loadFriendProfile(contact) {
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
        })
      })
      .catch(error => {
        dispatch(getFriendProfileFailure(error))
      })
  }
}
