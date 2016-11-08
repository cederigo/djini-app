import {OrderedMap} from 'immutable';
import {Platform, Linking} from 'react-native'

import {
  RESTORE_CONTACTS_REQUEST,
  RESTORE_CONTACTS_SUCCESS,
  RESTORE_CONTACTS_FAILURE,

  CONTACTS_REQUEST,
  CONTACTS_SUCCESS,
  CONTACTS_FAILURE,
  
  UPDATE_CONTACT,

  ON_SEARCH_FIELD_CHANGE,
  SAVE_CONTACTS,

  INVITE_CONTACT,
  CONTACTS_PERMISSION
} from '../lib/constants'

import {syncReminderNote, persistNotes, updateNotesNotifications} from './notes'
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
    const onAuthorized = () => {
      dispatch(contactsRequest())
      setTimeout(() => {
        Contacts.getAll()
          .then((contacts) => Parse.Cloud.run('mergeWithUsers', {contacts}))
          .then((contacts) => Contacts.transliterate(contacts))
          .then((contacts) => OrderedMap(contacts).sortBy(f => f.name))
          .then((contacts) => dispatch(contactsSuccess(contacts)))
          .then(() => {
            dispatch(saveContacts())
            dispatch(persistNotes())
          })
          .catch((error) => dispatch(contactsFailure(error)))
      }, 100)
    }
    dispatch(checkContactsPermission(onAuthorized))
  }
}

export function updateContact(contact, fields = {}) {
  return (dispatch) => {
    const update = {...contact, ...fields}
    let changed = false
    for (let field in fields) {
      if (fields[field] !== contact[field]) {
        changed = true
      }
    }
    if (changed) {
      dispatch({type: UPDATE_CONTACT, payload: update})
      dispatch(updateNotesNotifications())
    }
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

export function setFavorite(contact, isFavorite, syncWithNotes = true) {
  return dispatch => {
    dispatch(updateContact(contact, {isFavorite}))
    dispatch(saveContacts())
    if (syncWithNotes) {
      dispatch(syncReminderNote({...contact, isFavorite}))
    }
  }
}

export function invite(contact) {
  return dispatch => {
    dispatch({type: INVITE_CONTACT})
    const url = 'http://djini.ch/dl'
    const message = 'Hey! Schau dir mal die App «Djini» an. Damit kannst du Wünsche und Geschenkideen schnell und einfach festhalten und mit Freunden teilen. Yeah! Nie wieder Socken zum Geburtstag! ' + url
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

export function checkContactsPermission(onAuthorized) {
  return dispatch => {
    Contacts.checkPermission()
      .then((permission) => {
        dispatch({type: CONTACTS_PERMISSION, payload: permission})
        if (permission === 'authorized'){
          onAuthorized && onAuthorized()
        }
      })
      .catch((e) => {
        console.log('could not check contacts permission', e)
      })
  }
}

export function requestContactsPermission() {
  return dispatch => {
    Contacts.requestPermission()
      .then((permission) => {
        dispatch({type: CONTACTS_PERMISSION, payload: permission})
        if (permission === 'authorized') {
          dispatch(refreshContacts('user'))
        }
      })
      .catch((e) => {
        console.log('could not request contacts permission', e)
      })
  }
}
