import InitialState from './wishInitialState'

import {
  SAVE_WISH_REQUEST, 
  WISH_ADDED, 
  WISH_UPDATED, 
  SAVE_WISH_FAILURE, 
  SHOW_WISH,
  EDIT_WISH,
  NEW_WISH,
  ON_WISH_FIELD_CHANGE
} from '../../lib/constants'

import {fromParseWish} from '../wishes/wishesReducer'

const initialState = new InitialState;

function updateWish(state, wish) {
  return state.set(state.source === 'friend' ? 'wishOfFriend' : 'wish', wish)
}

export default function wishReducer(state = initialState, {type, payload}) {
  switch (type) {

    case SHOW_WISH: {
      const {wish, source, contact} = payload
      return updateWish(state.set('source', source), wish)
        .set('contact', contact)
        .set('editMode', false)
    }

    case EDIT_WISH:
      return updateWish(state, payload)
        .set('editMode', true)

    case NEW_WISH: {
     const {fromUser, toUser, source} = payload
     const newWish = initialState.wish
       .set('fromUserId', fromUser.id)
       .set('toUserId', toUser.id)
     return updateWish(state.set('source', source), newWish)
       .set('editMode', true)
    }

    case SAVE_WISH_REQUEST:
     return state.set('isFetching', true)
       .set('error', null)

    case WISH_UPDATED:
    case WISH_ADDED: {
      const wish = fromParseWish(payload.wish)
      const source = payload.source

      if (source === 'copy') {
        //nothing to do
        return state;
      }

      return updateWish(state, wish)
        .set('editMode', false)
        .set('isFetching', false)
        .set('error', null)
    }

    case SAVE_WISH_FAILURE:
      return state.set('isFetching', false)
        .set('error', payload)

    case ON_WISH_FIELD_CHANGE: {
      let {field, value} = payload
      if (field === 'price' && Number.isNaN(Number(value))) {
        value = state.getIn([state.source === 'friend' ? 'wishOfFriend' : 'wish', field]) // Previous value
      }
      return state.setIn([state.source === 'friend' ? 'wishOfFriend' : 'wish', field], value)
    }
  }
  /**
   * ## Default
   */
  return state;
}
