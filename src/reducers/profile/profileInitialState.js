/**
 * # profileInitialState.js
 */

/**
 * ## Import
 */
import {Record, List} from 'immutable'

/**
 * ## Form
 * This Record contains the state of the profile and the
 * fields it contains.
 */
const InitialState = Record({
    isFetchingWishes: false,
    isFetchingIdeas: false,
    error: null,
    user: null,
    theirWishes: List(),
    myIdeas: List()
})

export default InitialState;