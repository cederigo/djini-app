import InitialState from './wishInitialState'

import {
  SAVE_WISH_REQUEST, 
  SAVE_WISH_SUCCESS, 
  SAVE_WISH_FAILURE, 
  SET_WISH,
  SET_EDITABLE,
  RESET_WISH,
  ON_WISH_FIELD_CHANGE
} from '../../lib/constants'

const initialState = new InitialState;

export default function wishReducer(state = initialState, {type, payload}) {
  switch (type) {
    case SET_WISH:
      return state.set('wish', payload)

    case RESET_WISH:
     return initialState

    case SET_EDITABLE:
     return state.set('isEditable', payload)

    case SAVE_WISH_REQUEST:
     return state.set('isFetching', true)
       .set('isEditable', false)
       .set('error', null)

    case SAVE_WISH_SUCCESS:
      return state.set('isFetching', false)
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