import InitialState from './wishInitialState'

/**
 * ## Wish actions
 */
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
/**
 * ## authReducer function
 * @param {Object} state - initialState 
 * @param {Object} action - type and payload
 */
export default function wishReducer(state = initialState, {type, payload}) {
    switch (type) {
        case SET_WISH:
            state = state.set('wish', payload)
            return state
        case RESET_WISH:
            state = initialState
            return state
        case SET_EDITABLE:
            state = state.set('isEditable', payload)
            return state
        case SAVE_WISH_REQUEST:
            state = state.set('isFetching', true)
                .set('isEditable', false)
                .set('error', null)
            return state
        case SAVE_WISH_SUCCESS:
            state = state.set('isFetching', false)
                .set('error', null)
            return state
        case SAVE_WISH_FAILURE:
            state = state.set('isFetching', false)
                .set('error', payload)
            return state

        case ON_WISH_FIELD_CHANGE: {
            const {field, value} = payload
            state = state.setIn(['wish', field], value)
            return state // TODO: validation ?
        }
    }
    /**
    * ## Default
    */
    return state;
}