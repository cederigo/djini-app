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
  SAVE_WISH_REQUEST, 
  SAVE_WISH_REQUEST_FAILURE, 
  SAVE_WISH_REQUEST_SUCCESS
} from '../../lib/constants'

/**
 * Project requirements
 */
import Parse from '../../lib/Parse'

import {Actions} from 'react-native-router-flux'

/*
 * On wish field change
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
export function saveWishRequest() {
  return {
    type: SAVE_WISH_REQUEST
  };
}
export function saveWishRequestSuccess() {
  return {
    type: SAVE_WISH_REQUEST_SUCCESS
  };
}
export function sessionTokenRequestFailure(error) {
  return {
    type: SAVE_WISH_REQUEST_FAILURE,
    payload: error
  };
}
export function saveWish(title, description, url, user, owner) {
  return (dispatch, getState) => {
    dispatch(saveWishRequest())
    return new Parse().createObject('Wish', {   
        title: title, 
        description: description, 
        url: url,
        private: false, // TODO: set this from AddWish form
        user: {
            __type: 'Pointer',
            className: '_User',
            objectId: getState().global.currentUser.objectId
        },
        owner: {
            __type: 'Pointer',
            className: '_User',
            objectId: getState().global.currentUser.objectId
        }
      })
      .then((response) => {
        console.log(response)
        dispatch(saveWishSuccess())
        return response
      })
      .catch(error => {
        dispatch(saveWishFailure(error))
        return Promise.reject(error)
      })
  }
}