import {List} from 'immutable'
import InitialState from './friendInitialState'

/**
 * ## Friend actions
 */
import {
  GET_FRIEND_PROFILE_REQUEST,
  GET_FRIEND_PROFILE_SUCCESS,
  GET_FRIEND_PROFILE_FAILURE,
  WISH_DELETED,
  WISH_ADDED,
  WISH_UPDATED,
  TOGGLE_FAVORITE
} from '../../lib/constants'

import {isIdea} from '../../lib/wishUtil'

import {fromParseWish, sortWishBy} from '../wishes/wishesReducer'
import {fromParseUser} from '../global/globalReducer'

const initialState = new InitialState
/**
 * ## friendReducer function
 * @param {Object} state - initialState 
 * @param {Object} action - type and payload
 */
export default function friendReducer(state = initialState, {type, payload}) {
  switch (type) {
    case GET_FRIEND_PROFILE_REQUEST:
      return state.set('isFetching', true)
        .set('contact', payload)

    case GET_FRIEND_PROFILE_SUCCESS: {
      const {profile, contacts} = payload
      return state.set('isFetching', false)
        .set('ideas', List(profile.ideas.map((idea) => fromParseWish(idea))))
        .set('wishes', List(profile.wishes.map((wish) => fromParseWish(wish, contacts))))
        .set('user', fromParseUser(profile.user))
        .set('error', null)
    }

    case GET_FRIEND_PROFILE_FAILURE:
        return state.set('isFetching', false)
          .set('error', payload)

    case WISH_UPDATED: {
      const wish = fromParseWish(payload.wish)
      const key = isIdea(wish) ? 'ideas' : 'wishes'
      const collection = state.get(key)
      let idx = collection.findIndex((w) => w.id === wish.id)
      if (idx === -1) {
        return state //nothing to do
      }
      return state.set(key, collection.update(idx, () => wish).sortBy(sortWishBy).reverse()) //update
    }

    case WISH_ADDED: {
      const wish = fromParseWish(payload.wish)
      const ideas = state.get('ideas')
      if (!isIdea(wish)) {
        return state; //nothing to to
      }
      return state.set('ideas', ideas.unshift(wish).sortBy(sortWishBy).reverse()) //add
    }

    case WISH_DELETED: {
      const wish = payload
      const ideas = state.get('ideas')
      let idx = ideas.findIndex((w) => w.id === payload.id)
      if (!isIdea(wish) || idx === -1) {
        return state; //nothing to to
      }
      return state.set('ideas', ideas.delete(idx)) //delete
    }

    case TOGGLE_FAVORITE: {
      const contact = payload
      return state.set('contact', {...contact, isFavorite: !contact.isFavorite})
    }

  }
  /**
   * ## Default
   */
  return state
}