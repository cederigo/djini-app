import {Record} from 'immutable';
import Parse from 'parse/react-native'
import {Actions} from 'react-native-router-flux'

import {
  SAVE_WISH_REQUEST, 
  SAVE_WISH_FAILURE, 
  SAVE_WISH_SUCCESS,
  WISH_DELETED,
  ON_WISH_FIELD_CHANGE,
  SET_EDITABLE,
  SET_WISH,
  RESET_WISH
} from '../lib/constants'

/**
 * Project requirements
 */
const ParseWish = Parse.Object.extend('Wish')

import {Wish, User} from '../lib/types'

/*
 * set wish
 */
export function setWish(wish) {
  return {
    type: SET_WISH,
    payload: new (Record(wish))
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

export function newWish(fromUser: User, toUser: User) {
  return dispatch => {
    dispatch(resetWish())
    dispatch(onWishFieldChange('fromUserId', fromUser.id))
    dispatch(onWishFieldChange('toUserId', toUser.id))
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
export function saveWish(wish: Wish) {
  return dispatch => {

    dispatch(saveWishRequest())

    const {title, description, url, isPrivate, seenAt} = wish

    let parseWish = new ParseWish()
    //use existing id if possible
    parseWish.id = wish.id

    parseWish.save({
      title, description, url, isPrivate, seenAt,
      fromUser: parseUserPointer(wish.fromUserId),
      toUser: parseUserPointer(wish.toUserId),
      fullfiller: parseUserPointer(wish.fullfillerId)
    }).then((data) => {
        dispatch(saveWishSuccess(fromParseWish(data)))
      })
      .catch((error) => {
        dispatch(saveWishFailure(error))
      })
  }
}

/*
 * Delete Wish
 */
export function deleteWish(wish: Wish) {
  return dispatch => {
    if (!wish.id) {
      //nothing to do
      return
    }
    ParseWish.createWithoutData(wish.id).destroy()
      .then(() => {
        dispatch({type: WISH_DELETED, payload: wish})
      })
  }
}

export function fullfillWish(wish) {
  return dispatch => {
    dispatch(saveWishRequest())
    Parse.Cloud.run('fullfillWish', {wishId: wish.id})
    .then(data => {
      dispatch(saveWishSuccess(fromParseWish(data)))
    })
    .catch(error => {
      dispatch(saveWishFailure(error))
    })
  }
}

export function unfullfillWish(wish) {
  return dispatch => {
    dispatch(saveWishRequest())
    saveWish({...wish, fullfillerId: null})
      .then((data) => {
        dispatch(saveWishSuccess(fromParseWish(data)))
      })
      .catch(error => {
        dispatch(saveWishFailure(error))
      })
  }
}

/* Helper */
function parseUserPointer(userId) {
  return {
    __type: 'Pointer',
    className: '_User',
    objectId: userId 
  }
}

function fromParseWish(parseWish): Wish {
  let fullfiller = parseWish.get('fullfiller')
  return {
    id: parseWish.id,
    title: parseWish.get('title'),
    description: parseWish.get('description'),
    url: parseWish.get('url'),
    seenAt: parseWish.get('seenAt'),
    isPrivate: parseWish.get('isPrivate'),
    fromUserId: parseWish.get('fromUser').objectId, //pointer
    toUserId: parseWish.get('toUser').objectId,  //pointer
    fullfillerId: fullfiller ? fullfiller.objectId : undefined //pointer
  }
}