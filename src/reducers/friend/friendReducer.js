import InitialState from './friendInitialState'

/**
 * ## Friend actions
 */
import {
    GET_FRIEND_PROFILE_REQUEST,
    GET_FRIEND_PROFILE_SUCCESS,
    GET_FRIEND_PROFILE_FAILURE
} from '../../lib/constants'

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
          
        case GET_FRIEND_PROFILE_SUCCESS:
          return state.set('isFetching', false)
            .set('ideas', payload.ideas)
            .set('wishes', payload.wishes)
            .set('user', payload.user)
            .set('error', null)
            
        case GET_FRIEND_PROFILE_FAILURE:
          return state.set('isFetching', false)
            .set('error', payload)
     }
    /**
    * ## Default
    */
    return state
}