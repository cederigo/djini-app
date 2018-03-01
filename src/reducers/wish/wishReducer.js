import InitialState from './wishInitialState'

import {
  SAVE_WISH_REQUEST,
  WISH_UPDATED,
  SAVE_WISH_FAILURE,
  SHOW_WISH,
  EDIT_WISH,
  NEW_WISH
} from '../../lib/constants'

import { fromParseWish } from '../wishes/wishesReducer'

const initialState = new InitialState()

function updateWish(state, wish) {
  return state.set(state.source === 'friend' ? 'wishOfFriend' : 'wish', wish)
}

export default function wishReducer(state = initialState, { type, payload }) {
  switch (type) {
    case SHOW_WISH: {
      const { wish, source, contact } = payload
      return updateWish(state.set('source', source), wish)
        .set('contact', contact)
        .set('editMode', false)
    }

    case EDIT_WISH:
      return updateWish(state, payload)
        .set('error', null)
        .set('isFetching', false)
        .set('editMode', true)

    case NEW_WISH: {
      const { fromUser, toUser, source } = payload
      const newWish = initialState.wish.set('fromUserId', fromUser.id).set('toUserId', toUser.id)
      return updateWish(state.set('source', source), newWish)
        .set('editMode', true)
        .set('error', null)
        .set('isFetching', false)
    }

    case SAVE_WISH_REQUEST:
      return state.set('isFetching', true).set('error', null)

    case WISH_UPDATED: {
      const wish = fromParseWish(payload.wish)
      const source = payload.source

      if (source === 'copy') {
        //nothing to do
        return state
      }

      return updateWish(state, wish)
        .set('editMode', false)
        .set('isFetching', false)
        .set('error', null)
    }

    case SAVE_WISH_FAILURE:
      return state.set('isFetching', false).set('error', payload)
  }
  /**
   * ## Default
   */
  return state
}
