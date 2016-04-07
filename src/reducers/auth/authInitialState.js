/**
 * # authInitialState.js
 * 
 * This class is a Immutable object
 * Working *successfully* with Redux, requires
 * state that is immutable.
 * In my opinion, that can not be by convention
 * By using Immutable, it's enforced.  Just saying....
 *
 */
'use strict';
/**
 * ## Import
 */
import {Record} from 'immutable';
import {
  LOGIN
} from '../../lib/constants'

/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
const InitialState = Record({
  state: LOGIN,
  disabled: false,
  error: null,
  isValid: false,
  isFetching: false,
  fields: new (Record({
    phone: '',
    code: '',
    name: ''
  }))
});

export default InitialState;
