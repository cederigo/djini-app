/* global __DEV__ */
/**
 * # configureStore.js
 * 
 * A Redux boilerplate setup
 * 
 */

/**
 * ## Imports
 * 
 * redux functions
 */
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {createLogger} from 'redux-logger'
import {enableReduxLogger} from './config'

/**
* ## Reducer
* The reducer contains the reducers from 
* device, global
*/
import reducer from '../reducers'

const logger = createLogger();
const middlewares = [thunk]

if (__DEV__ && enableReduxLogger) {
  console.log('Adding redux-logger as middleware')
  middlewares.push(logger)
}

const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

/**
 * ## configureStore
 * @param {Object} the state with for keys:
 * device, global, auth, profile
 * 
 */ 
export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
