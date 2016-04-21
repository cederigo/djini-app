import {OrderedMap} from 'immutable';
import {Alert} from 'react-native'
import Share from 'react-native-share';
import {
  SOCIAL_STATE_REQUEST,
  SOCIAL_STATE_SUCCESS,
  SOCIAL_STATE_FAILURE,

  CONTACTS_REQUEST,
  CONTACTS_SUCCESS,
  CONTACTS_FAILURE,

  ON_SEARCH_FIELD_CHANGE,
  SAVE_SOCIAL_STATE,

  INVITE_CONTACT,
  SHOW_CONTACT
} from '../../lib/constants'

import contacts from '../../lib/contacts'
import Parse from '../../lib/Parse'
import db from '../../lib/db'

/*
 * Restore state from ./lib/db
 */
export function restoreStateRequest() {
  return {
    type: SOCIAL_STATE_REQUEST
  }
}
export function restoreStateSuccess(state) {
  return {
    type: SOCIAL_STATE_SUCCESS,
    payload: state
  }
}
export function restoreStateFailure(error) {
  return {
    type: SOCIAL_STATE_FAILURE,
    payload: error
  }
}
/**
 * Funny name ;-)
 */
export function restoreSocialState() {
  return dispatch => {
    dispatch(restoreStateRequest())
    return db.getSocialState()
      .then((state) => ({contacts: OrderedMap(state.contacts), favorites: OrderedMap(state.favorites)}))
      .then((state) => dispatch(restoreStateSuccess(state)))
      .catch(error => dispatch(restoreStateFailure(error)))
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
      .then((contacts) => new Parse().runCloudFunction('mergeWithUsers', {contacts}))
      .then((contacts) => OrderedMap(contacts).sortBy(f => f.name))
      .then((contacts) => dispatch(contactsSuccess(contacts)))
      .then(() => dispatch(saveState()))
      .catch((error) => dispatch(contactsFailure(error)))
  }
}

export function saveState() {
  return (dispatch, getState) => {
    const state = getState().social

    //dont save too often
    if ((Date.now() - state.lastSavedAt) < 60 * 1000) {
      return;
    }

    dispatch({type: SAVE_SOCIAL_STATE, payload: Date.now()})
    db.saveSocialState({contacts: state.contacts.entrySeq(), favorites: state.favorites.entrySeq()})
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

export function invite(contact) {
  return dispatch => {
    const inviteText = 'Ich möchte dir etwas schenken, weis aber nicht was ;-) https://wishmaster.ch/download'

    dispatch({type: INVITE_CONTACT, payload: contact})
    //TODO: dispatch global invite activity action (to server too)
    dispatch(saveState())
    Share.open({
      share_text: inviteText,
      share_URL: inviteText,
      title: inviteText 
    },(e) => {
      console.log(e);
    });
  }
}

export function show(contact) {
  return dispatch => {

    dispatch({type: SHOW_CONTACT, payload: contact})

    //TODO: dispatch global invite activity action
    Alert.alert('Show', 'View profile of ' + contact.name)

    dispatch(saveState())
  }
}
