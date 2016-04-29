/**
 * # profileInitialState.js
 */

/**
 * ## Import
 */
import {Record} from 'immutable'

/**
 * ## Form
 * This Record contains the state of the profile and the
 * fields it contains.
 */
const InitialState = Record({
    isFetching: false,
    error: null,
    user: null
})

export default InitialState;