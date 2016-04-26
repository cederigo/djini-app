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

/**
 * ## Form
 * This Record contains the state of the form and the
 * fields it contains.
 */
const InitialState = Record({
    isEditable: false,
    fields: new (Record({
        title: '',
        description: '',
        url: ''
  }))
})

export default InitialState;