import InitialState from './profileInitialState'

/**
 * ## Profile actions
 */
import {
    SET_PROFILE,
    GET_MY_IDEAS_REQUEST,
    GET_MY_IDEAS_SUCCESS,
    GET_MY_IDEAS_FAILURE,
    GET_THEIR_WISHES_REQUEST,
    GET_THEIR_WISHES_SUCCESS,
    GET_THEIR_WISHES_FAILURE
} from '../../lib/constants'

const initialState = new InitialState
/**
 * ## profileReducer function
 * @param {Object} state - initialState 
 * @param {Object} action - type and payload
 */
export default function profileReducer(state = initialState, {type, payload}) {
    switch (type) {
        case SET_PROFILE:
            return state.set('user', payload)
            
        case GET_MY_IDEAS_REQUEST:
          return state.set('isFetchingIdeas', true)
          
        case GET_MY_IDEAS_SUCCESS:
          return state.set('isFetchingIdeas', false)
            .set('myIdeas', payload)
            .set('error', null)
            
        case GET_MY_IDEAS_FAILURE:
          return state.set('isFetchingIdeas', false)
            .set('error', payload)
          
       case GET_THEIR_WISHES_REQUEST:
          return state.set('isFetchingWishes', true)
          
        case GET_THEIR_WISHES_SUCCESS:
          return state.set('isFetchingWishes', false)
            .set('theirWishes', payload)
            .set('error', null)
          
        case GET_THEIR_WISHES_FAILURE:
          return state.set('isFetchingWishes', false)
            .set('error', payload)
    }
    /**
    * ## Default
    */
    return state
}