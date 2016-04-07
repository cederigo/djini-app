/**
 * # globalInitialState.js
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
/**
 * ## InitialState
 *  
 * * currentUser - object returned from Parse.com when validated
 * * sessionToken - token used to authenticate. never expires
 *
 */
var InitialState = Record({
  currentUser: null,
  sessionToken: ''
});
export default InitialState;
