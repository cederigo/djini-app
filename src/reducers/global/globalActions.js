/**
 * # globalActions.js
 * 
 * Actions that are global in nature
 */

/**
 * ## Imports
 * 
 * The actions supported
 */
import {
  SET_SESSION_TOKEN
} from '../../lib/constants'

/**
 * ## set the sessionToken
 *
 */
export function setSessionToken(sessionToken) {
  return {
    type: SET_SESSION_TOKEN,
    payload: sessionToken
  };
}
