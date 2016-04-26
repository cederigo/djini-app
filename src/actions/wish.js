/**
 * # wishActions.js
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
  SAVE_WISH_FAILURE, 
  SAVE_WISH_SUCCESS,
  RESET_WISH,
  EDIT_WISH,
  WISH_SET_USERID
} from '../lib/constants'

/**
 * Project requirements
 */
import Parse from 'parse/react-native'
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
* New Wish
*/
export function resetWish() {
  return {
    type: RESET_WISH
  }
}

export function editWish() {
  return {
    type: EDIT_WISH
  }
}

export function wishSetUserId(userId) {
  return {
    type: WISH_SET_USERID,
    payload: userId
  }
}

export function newWish(userId) {
  return dispatch => {
    dispatch(resetWish())
    dispatch(wishSetUserId(userId))
    dispatch(editWish())
    Actions.wish()
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
export function saveWishSuccess() {
  return {
    type: SAVE_WISH_SUCCESS
  };
}
export function saveWishFailure(error) {
  return {
    type: SAVE_WISH_FAILURE,
    payload: error
  };
}
export function saveWish(wish) {
  return (dispatch, getState) => {
    dispatch(saveWishRequest())
    let ParseWish = Parse.Object.extend('Wish')
    let newParseWish = new ParseWish({
      title: wish.title, 
      description: wish.description, 
      url: wish.url,
      private: false, // TODO: set this from AddWish form
      user: {
        __type: 'Pointer',
        className: '_User',
        objectId: wish.userId
      },
      owner: {
        __type: 'Pointer',
        className: '_User',
        objectId: getState().global.currentUser.objectId
      } 
    })
    newParseWish.save()
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