/**
 * # authFormValidation.js
 * 
 * This class determines only if the form is valid 
 * so that the form button can be enabled.
 * if all the fields on the form are without error,
 * the form is considered valid
 */
'use strict';

/**
 * ## Imports
 * the actions being addressed
 */
import { LOGIN } from '../../lib/constants'

/**
 * ## formValidation
 * @param {Object} state - the Redux state object
 */
export default function formValidation (state) {

  switch(state.state) {
    case LOGIN:
      //TODO: proper phonenumber validation
      return state.set('isValid', state.fields.phone !== '')
  }
  /**
   * Default, return the state
   */
  return state;
}
