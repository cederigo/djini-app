import InitialState from './wishInitialState'

/**
 * ## Wish actions
 */
import {
    SAVE_WISH_REQUEST, 
    SAVE_WISH_SUCCESS, 
    SAVE_WISH_FAILURE, 
    SET_WISH,
    ON_WISH_FIELD_CHANGE
} from '../../lib/constants'

const initialState = new InitialState;
/**
 * ## authReducer function
 * @param {Object} state - initialState 
 * @param {Object} action - type and payload
 */
export default function wishReducer(state = initialState, {type, payload}) {
    switch (type) {
        case SET_WISH:
            state = state.set('fields', payload)
            return state
        
        case SAVE_WISH_REQUEST:
            // TODO
        case SAVE_WISH_SUCCESS:
            // TODO
        case SAVE_WISH_FAILURE:
            // TODO
            return state

        case ON_WISH_FIELD_CHANGE: {
            console.log('wish field change')
            const {field, value} = payload
            state = state.setIn(['fields', field], value)
            return state // TODO: validation ?
        }
    }
    /**
    * ## Default
    */
    return state;
}