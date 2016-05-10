import InitialState from './socialInitialState';

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
  SHOW_CONTACT,
  TOGGLE_FAVORITE,
} from '../../lib/constants'

const initialState = new InitialState;

export default function socialReducer(state = initialState, {type, payload}) {
  switch(type) {
    case SOCIAL_STATE_REQUEST:
    case CONTACTS_REQUEST:
      return state.set('isFetching', true)

    case SOCIAL_STATE_SUCCESS: {
      const {contacts} = payload
      return state.set('isFetching', false)
        .set('contacts', contacts)
    }

    case SAVE_SOCIAL_STATE: {
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

    case SOCIAL_STATE_FAILURE:
    case CONTACTS_FAILURE:
      return state.set('isFetching', false)
        .set('noContactsPermission', payload.message === 'permissionDenied')
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
