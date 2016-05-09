import InitialState from './wishesInitialState'

/**
 * ## Wishes actions
 */
import {
    MY_PROFILE_LOADED,
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
  }
  /**
   * ## Default
   */
  return state
}