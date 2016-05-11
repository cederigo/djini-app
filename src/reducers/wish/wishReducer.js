import InitialState from './wishInitialState'

import {
  SAVE_WISH_REQUEST, 
  SAVE_WISH_SUCCESS, 
  SAVE_WISH_FAILURE, 
  SHOW_WISH,
  EDIT_WISH,
  NEW_WISH,
  ON_WISH_FIELD_CHANGE
} from '../../lib/constants'

import {fromParseWish} from '../wishes/wishesReducer'

const initialState = new InitialState;

export default function wishReducer(state = initialState, {type, payload}) {
  switch (type) {

    case SHOW_WISH:
      return state.set('wish', payload)
        .set('editMode', false)

    case EDIT_WISH:
      return state.set('wish', payload)
        .set('editMode', true)

    case NEW_WISH: {
     const {fromUser, toUser} = payload
     return initialState
        .set('editMode', true)
        .setIn(['wish', 'fromUserId'], fromUser.id)
        .setIn(['wish', 'toUserId'], toUser.id)
    }

    case SAVE_WISH_REQUEST:
     return state.set('isFetching', true)
       .set('editMode', false)
       .set('error', null)

    case SAVE_WISH_SUCCESS:
      const wish = fromParseWish(payload)
      return state.set('isFetching', false)
       .set('wish', wish)
       .set('error', null)

    case SAVE_WISH_FAILURE:
      return state.set('isFetching', false)
        .set('error', payload)

    case ON_WISH_FIELD_CHANGE: {
      const {field, value} = payload
        return state.setIn(['wish', field], value)
    }
  }
  /**
   * ## Default
   */
  return state;
}