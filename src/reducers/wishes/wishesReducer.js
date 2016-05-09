import InitialState from './wishesInitialState'

/**
 * ## Wishes actions
 */
import {
    MY_PROFILE_LOADED,
    SAVE_WISH_SUCCESS,
    WISH_DELETED,
} from '../../lib/constants'

const initialState = new InitialState
/**
 * ## wishesReducer function
 * @param {Object} state - initialState 
 * @param {Object} action - type and payload
 */
export default function wishesReducer(state = initialState, {type, payload}) {
  switch (type) {
    case MY_PROFILE_LOADED:
      return state.set('isFetching', false)
        .set('error', null)
        .set('wishes', payload.wishes)

    case SAVE_WISH_SUCCESS: {
      const wishes = state.get('wishes')
      let idx = wishes.findIndex((w) => w.id === payload.id)
      if (idx === -1) {
        return state.set('wishes', wishes.unshift(payload)) //add
      } else {
        return state.set('wishes', wishes.update(idx, () => payload)) //update
      }
    }

    case WISH_DELETED: {
      const wishes = state.get('wishes')
      let idx = wishes.findIndex((w) => w.id === payload.id)
      if (idx === -1) {
        return state; //no change
      }
      return state.set('wishes', wishes.delete(idx))
    }
  }
  /**
   * ## Default
   */
  return state
}