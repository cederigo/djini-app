import InitialState from './wishInitialState'

/**
 * ## Wish actions
 */
import {
    SAVE_WISH, ON_WISH_FIELD_CHANGE
} from '../../lib/constants'

const initialState = new InitialState;
/**
 * ## authReducer function
 * @param {Object} state - initialState 
 * @param {Object} action - type and payload
 */
export default function wishReducer(state = initialState, {type, payload}) {
    switch (type) {
        case SAVE_WISH:
            console.log('save wish');
            return state; //TODO

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