/**
 * # authActions.js
 * 
 * All the request actions have 3 variations, the request, a success
 * and a failure. They all follow the pattern that the request will
 * set the ```isFetching``` to true and the whether it's successful or
 * fails, setting it back to false.
 * 
 */

import {
    ON_WISH_FIELD_CHANGE,
  SAVE_WISH
} from '../../lib/constants'

/**
 * Project requirements
 */
import Parse from '../../lib/Parse'
import db from '../../lib/db'

import {Actions} from 'react-native-router-flux'

/*
 * On form field change
 */
export function onWishFieldChange(field, value) {
  return {
    type: ON_WISH_FIELD_CHANGE,
    payload: {field, value}
  }
}

/*
 * Save Wish
 */
export function saveWish(title, description, url) {
  return {
      type: SAVE_WISH,
      payload: {title, description, url}
  } 
}