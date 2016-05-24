import {OrderedMap} from 'immutable';
import InitialState from './contactsInitialState';

import {
  RESTORE_CONTACTS_REQUEST,
  RESTORE_CONTACTS_SUCCESS,
  RESTORE_CONTACTS_FAILURE,

  CONTACTS_REQUEST,
  CONTACTS_SUCCESS,
  CONTACTS_FAILURE,

  ON_SEARCH_FIELD_CHANGE,
  SAVE_CONTACTS,

  INVITE_CONTACT,
  SHOW_CONTACT,
  TOGGLE_FAVORITE,
} from '../../lib/constants'

const initialState = new InitialState;

export default function contactsReducer(state = initialState, {type, payload}) {
  switch(type) {
    case RESTORE_CONTACTS_REQUEST:
      return state.set('isFetching', true)

    case CONTACTS_REQUEST:
      return state.set('isFetching', true)
        .set('pristine', false)

    case RESTORE_CONTACTS_SUCCESS: {
      const contacts = OrderedMap(payload)
      return state.set('isFetching', false)
        .set('pristine', false) //In pristine state restoring contacts fails. So if we succeed, we can safely assume we are not in pristine state
        .set('contacts', contacts)
    }

    case SAVE_CONTACTS: {
      return state.set('lastSavedAt', payload)
    }

    case CONTACTS_SUCCESS: {
      const newContacts = payload
      const contacts = state.get('contacts')
      return state.set('isFetching', false)
        .set('contacts', newContacts.map(newContact => {
          //keep local favorites
          const contact = contacts.get(newContact.phoneNumber)
          return {...newContact, isFavorite: contact && contact.isFavorite}
        }))
    }

    case RESTORE_CONTACTS_FAILURE:
    case CONTACTS_FAILURE:
      return state.set('isFetching', false)
        .set('permissionDenied', payload.message === 'permissionDenied')
        .set('error', payload)

    case ON_SEARCH_FIELD_CHANGE:
        return state.set('filterText', payload)

    case TOGGLE_FAVORITE: {
      const contact = payload
      const contacts = state.get('contacts')
      return state.set('contacts', contacts.set(contact.phoneNumber, {...contact, isFavorite: !contact.isFavorite}))
    }

    case SHOW_CONTACT:
    case INVITE_CONTACT: {
      //TODO: maybe mark as invited?
      return state
    }
  
  }
  return state;
}
