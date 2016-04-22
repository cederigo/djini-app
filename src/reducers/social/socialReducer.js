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
  ADD_FAVORITE
} from '../../lib/constants'

const initialState = new InitialState;

export default function socialReducer(state = initialState, {type, payload}) {
  switch(type) {
    case SOCIAL_STATE_REQUEST:
    case CONTACTS_REQUEST:
      return state.set('isFetching', true)

    case SOCIAL_STATE_SUCCESS: {
      const {contacts, favorites} = payload
      return state.set('isFetching', false)
        .set('contacts', contacts)
        .set('favorites', favorites)
    }

    case SAVE_SOCIAL_STATE: {
      return state.set('lastSavedAt', payload)
    }

    case CONTACTS_SUCCESS: {
      const contacts = payload
      let favorites = state.get('favorites')
      //duplicate data not so nice ...
      favorites = favorites.filter(f => contacts.has(f.phoneNumber)) //handle deletions
      favorites = favorites.map(f => contacts.get(f.phoneNumber))
      return state.set('isFetching', false)
        .set('contacts', contacts)
        .set('favorites', favorites)
    }

    case SOCIAL_STATE_FAILURE:
    case CONTACTS_FAILURE:
      return state.set('isFetching', false)
        .set('error', payload)

    case ON_SEARCH_FIELD_CHANGE:
        return state.set('filterText', payload)

    case ADD_FAVORITE: {
      const {contact, accessedAt} = payload
        const favorites = state.get('favorites')
      return state.set('favorites', 
        favorites
          .set(contact.phoneNumber, {...contact, accessedAt})
          .sortBy(c => c.accessedAt)
          .takeLast(10) //max 10 favorites
          .sortBy(c => c.name)
      )
    }

    case SHOW_CONTACT:
    case INVITE_CONTACT: {
      //TODO: maybe mark as invited?
      return state
    }
  
  }
  return state;
}
