import { OrderedMap } from 'immutable'
import InitialState from './contactsInitialState'

import {
  RESTORE_CONTACTS_REQUEST,
  RESTORE_CONTACTS_SUCCESS,
  RESTORE_CONTACTS_FAILURE,
  CONTACTS_REQUEST,
  CONTACTS_SUCCESS,
  CONTACTS_FAILURE,
  CONTACTS_PERMISSION,
  ON_SEARCH_FIELD_CHANGE,
  SAVE_CONTACTS,
  INVITE_CONTACT,
  SHOW_CONTACT,
  UPDATE_CONTACT
} from '../../lib/constants'

const initialState = new InitialState()

export default function contactsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case RESTORE_CONTACTS_REQUEST:
      return state.set('isFetching', true)

    case CONTACTS_REQUEST:
      return state.set('isFetching', true).set('pristine', false)

    case RESTORE_CONTACTS_SUCCESS: {
      const contacts = OrderedMap(payload)
      return state
        .set('isFetching', false)
        .set('pristine', false) //In pristine state restoring contacts fails. So if we succeed, we can safely assume we are not in pristine state
        .set('contacts', contacts)
    }

    case SAVE_CONTACTS: {
      return state.set('lastSavedAt', payload)
    }

    case CONTACTS_SUCCESS: {
      return state.set('isFetching', false).set('contacts', payload)
    }

    case RESTORE_CONTACTS_FAILURE:
    case CONTACTS_FAILURE:
      return state
        .set('isFetching', false)
        .set('permissionDenied', payload.message === 'permissionDenied')
        .set('error', payload)

    case CONTACTS_PERMISSION:
      return state.set('permissionDenied', payload === 'denied')

    case ON_SEARCH_FIELD_CHANGE:
      return state.set('filterText', payload)

    case UPDATE_CONTACT: {
      const contact = payload
      const contacts = state.get('contacts')
      return state.set('contacts', contacts.set(contact.phoneNumber, contact))
    }

    case SHOW_CONTACT:
    case INVITE_CONTACT: {
      //TODO: maybe mark as invited?
      return state
    }
  }
  return state
}
