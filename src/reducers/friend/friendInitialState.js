/**
 * # friendInitialState.js
 */

/**
 * ## Import
 */
import { Record, List } from 'immutable'

/**
 * ## Form
 * This Record contains the state of the profile and the
 * fields it contains.
 */
const InitialState = Record({
  isFetching: false,
  error: null,
  user: {},
  contact: null,
  wishes: List(),
  ideas: List()
})

export default InitialState
