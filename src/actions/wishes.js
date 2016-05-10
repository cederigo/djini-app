import {Record} from 'immutable';
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

/**
 * Project requirements
 */
const ParseWish = Parse.Object.extend('Wish')

import {Wish, User} from '../lib/types'

export function showWish(wish) {
  return dispatch => {
    dispatch({type: SHOW_WISH, payload: new (Record(wish))})
    Actions.wish()
  }
}

export function editWish(wish) {
  debugger
  return dispatch => {
    dispatch({type: EDIT_WISH, payload: new (Record(wish))})
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