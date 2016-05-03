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
  GET_USER_WISHES_REQUEST,
  GET_USER_WISHES_SUCCESS, 
  GET_USER_WISHES_FAILURE,
  SAVE_WISH_REQUEST, 
  SAVE_WISH_FAILURE, 
  SAVE_WISH_SUCCESS,
  ON_WISH_FIELD_CHANGE,
  SET_EDITABLE,
  SET_WISH,
  RESET_WISH
} from '../lib/constants'

/**
 * Project requirements
 */
import Parse from 'parse/react-native'
import {Actions} from 'react-native-router-flux'
import {Immutable, List, Record} from 'immutable'

const Wish = Record({
  id: '',
  title: '',
  url: '',
  description: '',
  seenAt: '',
  private: false,
  userId: '',
  ownerId: ''
})

/*
 * Get user wishes
 */
export function getUserWishesRequest() {
  return {
    type: GET_USER_WISHES_REQUEST
  }
}

export function getUserWishesSuccess(wishes) {
  return {
    type: GET_USER_WISHES_SUCCESS,
    payload: wishes
  }
}

export function getUserWishesFailure() {
  return {
    type: GET_USER_WISHES_FAILURE
  }
}

export function getUserWishes() {
  let wishes
  return (dispatch, getState) => {
    dispatch(getUserWishesRequest())
    let query = new Parse.Query('Wish')
    const userPointer = {
      __type: 'Pointer',
      className: '_User',
      objectId: getState().global.currentUser.id
    }
    const ownerPointer = {
      __type: 'Pointer',
      className: '_User',
      objectId: getState().global.currentUser.id
    }
    query.equalTo('user', userPointer)
    query.equalTo('owner', ownerPointer)
    return query.find()
    .then((response) => {
      wishes = List(response.map((wish) => {
        return new Wish({
          id: wish.id,
          title: wish.attributes.title,
          url: wish.attributes.url,
          description: wish.attributes.description,
          seenAt: wish.attributes.seenAt,
          private: wish.attributes.private,
          userId: wish.attributes.user.id,
          ownerId: wish.attributes.owner.id
        })
      }))
      dispatch(getUserWishesSuccess(wishes))
    })
    .catch(error => {
      dispatch(getUserWishesFailure(error))
    })
  }
}
/*
 * set wish
 */
export function setWish(wish) {
  return {
    type: SET_WISH,
    payload: wish
  }
}
/*
 * show wish
 */
export function show(wish) {
  return dispatch => {
    dispatch(setEditable(false))
    dispatch(setWish(wish))
    Actions.wish()
  }
}
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

export function setEditable(value) {
  return {
    type: SET_EDITABLE,
    payload: value
  }
}

export function newWish(userId) {
  return (dispatch, getState) => {
    dispatch(resetWish())
    dispatch(onWishFieldChange('userId', userId))
    dispatch(onWishFieldChange('ownerId', getState().global.currentUser.id))
    dispatch(setEditable(true))
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
    if (!wish.id) {
      // new wish
    dispatch(saveWishRequest())
    let ParseWish = Parse.Object.extend('Wish')
    let newParseWish = new ParseWish({
      title: wish.title, 
      description: wish.description, 
      url: wish.url,
      seenAt: wish.seenAt,
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
          dispatch(getUserWishes())
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
      parseWish.set('seenAt', wish.seenAt)
      parseWish.set('private', wish.private)
      return parseWish.save()
    })
    .then((response) => {
      dispatch(saveWishSuccess())
      // update my wishes
      if (wish.ownerId === getState().global.currentUser.id) {
        dispatch(getUserWishes())
      }
    })
    .catch(error => {
      dispatch(saveWishError(error))
    })
  }
}
/*
 * Delete Wish
 */
export function deleteWish(wish) {
  return (dispatch, getState) => {
    dispatch(saveWishRequest())
    let ParseWish = Parse.Object.extend('Wish')
    let query = new Parse.Query(ParseWish)
    query.get(wish.id)
    .then((parseWish) => {
      return parseWish.destroy()
    })
    .then((response) => {
      dispatch(saveWishSuccess())
      // update my wishes
      if (wish.ownerId === getState().global.currentUser.id) {
        dispatch(getUserWishes())
      }
    })
    .catch((error) => {
      dispatch(saveWishSuccess(error))
    })
  }
}