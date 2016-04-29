import InitialState from './profileInitialState'

/**
 * ## Profile actions
 */
import {
    SET_PROFILE
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
    }
    /**
    * ## Default
    */
    return state
}