import {List} from 'immutable'
import InitialState from './friendInitialState'

/**
 * ## Friend actions
 */
import {
  GET_FRIEND_PROFILE_REQUEST,
  GET_FRIEND_PROFILE_SUCCESS,
  GET_FRIEND_PROFILE_FAILURE,
  SAVE_WISH_SUCCESS,
  WISH_DELETED,
} from '../../lib/constants'

import {fromParseWish} from '../wishes/wishesReducer'
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

    case GET_FRIEND_PROFILE_SUCCESS: {
      const {profile, contact} = payload
      return state.set('isFetching', false)
        .set('ideas', List(profile.ideas.map(fromParseWish)))
        .set('wishes', List(profile.wishes.map(fromParseWish)))
        .set('user', fromParseUser(profile.user))
        .set('contact', contact)
        .set('error', null)
    }

    case GET_FRIEND_PROFILE_FAILURE:
        return state.set('isFetching', false)
          .set('error', payload)

    case SAVE_WISH_SUCCESS: {
      let friend = state.get('user')
      const wish = fromParseWish(payload)
      if (!friend || friend.id !== wish.toUserId) {
        return state; //nothing to to
      }

      const ideas = state.get('ideas')
      let idx = ideas.findIndex((w) => w.id === wish.id)
      if (idx === -1) {
        return state.set('ideas', ideas.unshift(wish)) //add
      } else {
        return state.set('ideas', ideas.update(idx, () => wish)) //update
      }
    }

    case WISH_DELETED: {
      let friend = state.get('user')
      if (!friend || friend.id !== payload.toUserId) {
        return state; //nothing to to
      }


      const ideas = state.get('ideas')
      let idx = ideas.findIndex((w) => w.id === payload.id)
      if (idx === -1) {
        return state; //no change
      }
      return state.set('ideas', ideas.delete(idx))
    }

  }
  /**
   * ## Default
   */
  return state
}