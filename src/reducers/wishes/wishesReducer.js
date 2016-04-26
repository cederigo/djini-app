import InitialState from './wishesInitialState'

/**
 * ## Wishes actions
 */
import {
    GET_USER_WISHES_REQUEST,
    GET_USER_WISHES_SUCCESS,
    GET_USER_WISHES_FAILURE
} from '../../lib/constants'

const initialState = new InitialState
/**
 * ## wishesReducer function
 * @param {Object} state - initialState 
 * @param {Object} action - type and payload
 */
export default function wishesReducer(state = initialState, {type, payload}) {
    switch (type) {
        case GET_USER_WISHES_REQUEST:
            return state.set('isFetching', true)
            .set('error', null)
                
        case GET_USER_WISHES_SUCCESS:
            return state.set('isFetching', false)
            .set('wishes', payload)
            .set('error', null)
                
        case GET_USER_WISHES_FAILURE:
            return state.set('isFetching', false)
            .set('error', payload)
    }
    /**
    * ## Default
    */
    return state
}