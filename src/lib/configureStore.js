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
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';

/**
* ## Reducer
* The reducer contains the reducers from 
* device, global
*/
import reducer from '../reducers';

const logger = createLogger();

/**
 * ## creatStoreWithMiddleware
 * Like the name...
 */ 
const createStoreWithMiddleware = applyMiddleware(
  thunk, logger
)(createStore);

/**
 * ## configureStore
 * @param {Object} the state with for keys:
 * device, global, auth, profile
 * 
 */ 
export default function configureStore(initialState) {
  return createStoreWithMiddleware(reducer, initialState);
}
