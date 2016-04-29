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
  WISH_SET_USERID,
  WISH_SET_OWNERID,
  SET_PRIVATE
} from '../lib/constants'

import * as wishesActions from './wishes'

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

export function wishSetOwnerId(ownerId) {
  return {
    type: WISH_SET_OWNERID,
    payload: ownerId
  }
}

export function newWish(userId) {
  return (dispatch, getState) => {
    dispatch(resetWish())
    dispatch(wishSetUserId(userId))
    dispatch(wishSetOwnerId(getState().global.currentUser.id))
    dispatch(editWish())
    Actions.wish()
  }
}
/*Set Private*/
export function setPrivate(value) {
  return {
    type: SET_PRIVATE,
    payload: value
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
    if (!wish.id) {
      // new wish
    dispatch(saveWishRequest())
    let ParseWish = Parse.Object.extend('Wish')
    let newParseWish = new ParseWish({
      title: wish.title, 
      description: wish.description, 
      url: wish.url,
      private: wish.private,
      user: {
        __type: 'Pointer',
        className: '_User',
        objectId: wish.userId
      },
      owner: {
        __type: 'Pointer',
        className: '_User',
        objectId: getState().global.currentUser.id // owner is always the current user
      } 
    })
    newParseWish.save()
      .then((response) => {
        dispatch(saveWishSuccess())
        // update my wishes
        if (wish.ownerId === getState().global.currentUser.id) {
          dispatch(wishesActions.getUserWishes())
        }
      })
      .catch(error => {
        dispatch(saveWishFailure(error))
      })
    } else {
      // existing wish
      dispatch(updateWish(wish))
    }
  }
}
/*
 * Update Wish
 */
export function updateWishRequest() {
  return {
    type: UPDATE_WISH_REQUEST
  };
}
export function updateWishSuccess() {
  return {
    type: UPDATE_WISH_SUCCESS
  };
}
export function updateWishFailure(error) {
  return {
    type: UPDATE_WISH_FAILURE,
    payload: error
  };
}
export function updateWish(wish) {
  return (dispatch, getState) => {
    dispatch(saveWishRequest())
    let ParseWish = Parse.Object.extend('Wish')
    let query = new Parse.Query(ParseWish)
    query.get(wish.id)
    .then((parseWish) => {
      parseWish.set('title', wish.title)
      parseWish.set('url', wish.url)
      parseWish.set('description', wish.description)
      parseWish.set('private', wish.private)
      return parseWish.save()
    })
    .then((response) => {
      dispatch(saveWishSuccess())
      // update my wishes
      if (wish.ownerId === getState().global.currentUser.id) {
        dispatch(wishesActions.getUserWishes())
      }
    })
    .catch(error => {
      dispatch(saveWishError(error))
    })
  }
}
