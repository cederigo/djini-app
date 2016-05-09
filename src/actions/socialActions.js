import {OrderedMap, List} from 'immutable';
import {ActionSheetIOS, Platform} from 'react-native'
import Share from 'react-native-share';
import {Actions} from 'react-native-router-flux'

import {
  SOCIAL_STATE_REQUEST,
  SOCIAL_STATE_SUCCESS,
  SOCIAL_STATE_FAILURE,

  CONTACTS_REQUEST,
  CONTACTS_SUCCESS,
  CONTACTS_FAILURE,

  GET_FRIEND_PROFILE_REQUEST,
  GET_FRIEND_PROFILE_SUCCESS,
  GET_FRIEND_PROFILE_FAILURE,

  ON_SEARCH_FIELD_CHANGE,
  SAVE_SOCIAL_STATE,

  ADD_FAVORITE  
} from '../lib/constants'

import contacts from '../lib/contacts'
import Parse from 'parse/react-native'
import db from '../lib/db'

import {User, Wish} from '../lib/types'

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
      .then((contacts) => Parse.Cloud.run('mergeWithUsers', {contacts}))
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
    if ((Date.now() - state.lastSavedAt) < 10 * 1000) {
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

export function addFavorite(contact) {
  return {
    type: ADD_FAVORITE,
    payload: {contact, accessedAt: Date.now()}
  
  }
}

export function invite(contact) {
  return dispatch => {
    const url = 'https://tsfr.io/j9n6rp'
    const message = 'Ich möchte dir etwas schenken, weis aber nicht was...';
    dispatch(addFavorite(contact))
    //TODO: dispatch global invite activity action (to server too)
    dispatch(saveState())
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

export function show(contact) {
  return dispatch => {
    dispatch(addFavorite(contact))
    dispatch(getFriendProfileRequest)
    _getFriendProfile(contact)
    .then(friend => {
      dispatch(getFriendProfileSuccess(friend))
      dispatch(saveState())
      Actions.friend()
    })
    .catch(error => {
      dispatch(getFriendProfileFailure(error))
    })
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

export function updateFriendProfile() {
  return (dispatch, getState) => {
    dispatch(getFriendProfileRequest())
    const {user} = getState().friend
    _getFriendProfile(user)
    .then(friend => {
      dispatch(getFriendProfileSuccess(friend))
      dispatch(saveState()) // is this needed?
    })
    .catch(error => {
      dispatch(getFriendProfileFailure(error))
    })
  }
}

function _getFriendProfile(contact) {
  return Parse.Cloud.run('getFriendProfile', {phoneNumber: contact.phoneNumber})
    .then((response) => {
      let friend: {user: User, wishes: List<Wish>, ideas: List<Wish>} = {
        user: {
          phoneNumber: contact.phoneNumber,
          name: contact.name,
          id: response.user.id,
          birthday: response.user.birthday,
          registered: response.user.registered
        },
        wishes: List(response.wishes),
        ideas: List(response.ideas)
      }
      return friend
    })
}