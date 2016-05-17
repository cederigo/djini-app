import Record from 'immutable'
import Parse from 'parse/react-native'
import {Actions} from 'react-native-router-flux'

import { Alert } from 'react-native';

import {
  SAVE_WISH_REQUEST, 
  SAVE_WISH_FAILURE, 
  WISH_ADDED,
  WISH_UPDATED,
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
export function wishAdded(wish) {
  return {
    type: WISH_ADDED,
    payload: wish
  };
}
export function wishUpdated(wish) {
  return {
    type: WISH_UPDATED,
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
      fulfiller: parseUserPointer(wish.fulfillerId)
    }

    delete attributes.fromUserId
    delete attributes.toUserId
    delete attributes.fulfillerId

    parseWish.save(attributes).then((data) => {
      if (wish.id) {
        dispatch(wishUpdated(data))
      } else {
        dispatch(wishAdded(data))
      }
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

    function deleteConfirmed() {
      ParseWish.createWithoutData(wish.id).destroy()
        .then(() => {
          dispatch({type: WISH_DELETED, payload: wish})
        })
    }

    //Dont know if this is the right place for a confirmation dialog
    //see: https://github.com/reactjs/redux/issues/1528
    Alert.alert(
      'Wunsch löschen?', //title
      `Möchtest du den Wunsch ${wish.title} wirklich löschen?`, //message
      [
        {text: 'Abbrechen', style: 'cancel'},
        {text: 'Ja', onPress: deleteConfirmed},
      ]
    )
  }
}

export function fulfillWish(wish) {
  return dispatch => {
    dispatch(saveWishRequest())
    Parse.Cloud.run('fulfillWish', {wishId: wish.id})
    .then(data => {
      dispatch(wishUpdated(data))
    })
    .catch(error => {
      dispatch(saveWishFailure(error))
      if (error.message.code === 'Wish is already fulfilled.') {
        Alert.alert('Jemand war schneller', 'Dieser Wunsch ist schon erfüllt.')
      }
    })
  }
}

/* Helper */
function parseUserPointer(userId) {
  if (!userId) {
    return null
  }

  return {
    __type: 'Pointer',
    className: '_User',
    objectId: userId 
  }
}