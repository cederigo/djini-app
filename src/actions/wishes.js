import Record from 'immutable'
import Parse from 'parse/react-native'
import {Actions} from 'react-native-router-flux'

import {
  SAVE_WISH_REQUEST, 
  SAVE_WISH_FAILURE, 
  SAVE_WISH_SUCCESS,
  WISH_DELETED,
  ON_WISH_FIELD_CHANGE,
  SHOW_WISH,
  EDIT_WISH,
  NEW_WISH
} from '../lib/constants'

const ParseWish = Parse.Object.extend('Wish')

import {Wish, User} from '../lib/types'

export function showWish(wish) {
  return dispatch => {
    dispatch({type: SHOW_WISH, payload: wish})
    Actions.wish()
  }
}

export function editWish(wish) {
  return dispatch => {
    dispatch({type: EDIT_WISH, payload: wish})
    Actions.wish()
  }
}

export function onWishFieldChange(field, value) {
  return {
    type: ON_WISH_FIELD_CHANGE,
    payload: {field, value}
  }
}

export function newWish(fromUser: User, toUser: User) {
  return dispatch => {
    dispatch({type: NEW_WISH, payload: {fromUser, toUser}})
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
export function saveWishSuccess(wish) {
  return {
    type: SAVE_WISH_SUCCESS,
    payload: wish
  };
}
export function saveWishFailure(error) {
  return {
    type: SAVE_WISH_FAILURE,
    payload: error
  };
}
export function saveWish(wish: Record<Wish>) {
  return dispatch => {
    dispatch(saveWishRequest())

    //use existing id if possible
    let parseWish = ParseWish.createWithoutData(wish.id)
    let attributes = {
      ...wish.toObject(),
      fromUser: parseUserPointer(wish.fromUserId),
      toUser: parseUserPointer(wish.toUserId),
      fullfiller: parseUserPointer(wish.fullfillerId)
    }

    delete attributes.fromUserId
    delete attributes.toUserId
    delete attributes.fullfillerId

    parseWish.save(attributes).then((data) => {
      dispatch(saveWishSuccess(data))
    })
    .catch((error) => {
      dispatch(saveWishFailure(error))
    })
  }
}

export function deleteWish(wish: Wish) {
  return dispatch => {
    if (!wish.id) {
      //nothing to do
      return
    }
    ParseWish.createWithoutData(wish.id).destroy()
      .then(() => {
        dispatch({type: WISH_DELETED, payload: wish})
        Actions.pop()
      })
  }
}

export function fullfillWish(wish) {
  return dispatch => {
    dispatch(saveWishRequest())
    Parse.Cloud.run('fullfillWish', {wishId: wish.id})
    .then(data => {
      dispatch(saveWishSuccess(data))
    })
    .catch(error => {
      dispatch(saveWishFailure(error))
    })
  }
}

/* Helper */
function parseUserPointer(userId) {
  if (!userId) {
    return; //undefined
  }

  return {
    __type: 'Pointer',
    className: '_User',
    objectId: userId 
  }
}