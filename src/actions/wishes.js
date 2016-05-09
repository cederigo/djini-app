import {Record} from 'immutable';
import Parse from 'parse/react-native'
import {Actions} from 'react-native-router-flux'
import {Alert} from 'react-native'

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

import {updateFriendProfile} from './socialActions'


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
      toUser: parseUserPointer(wish.toUserId)
    }).then((data) => {
        dispatch(saveWishSuccess(data))
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

/* 
* fullfill wish 
*/
export function fullfillWish(wish) {
  return (dispatch, getState) => {
    dispatch(saveWishRequest())
    Parse.Cloud.run('fullfillWish', {wishId: wish.id})
    .then((response) => {
      dispatch(saveWishSuccess())
      // local update
      dispatch(onWishFieldChange('fullfillerId', getState().global.currentUser.id))
      // update my wishes
      if (wish.userId === getState().global.currentUser.id) {
        dispatch(getMyWishes())
      } else {
        // update friend wishes
        dispatch(updateFriendProfile())  
      }        
    })
    .catch(error => {
      dispatch(saveWishFailure(error))
      if (error.message.code === 'Wish is already fullfilled.') {
        dispatch(onWishFieldChange('fullfillerId', 'XXXX'))
        dispatch(updateFriendProfile())
        Alert.alert('Jemand war schneller', 'Dieser Wunsch ist schon erfüllt.')
      }
    })
  }
}
/* 
* unfullfill wish 
*/
export function unfullfillWish(wish) {
  return (dispatch, getState) => {
    dispatch(saveWishRequest())
    _getWish(wish)
    .then((parseWish) => {
      parseWish.set('fullfiller', null)
      return parseWish.save()
    })
    .then((response) => {
      dispatch(saveWishSuccess())
      // local update
      dispatch(onWishFieldChange('fullfillerId', ''))
      // update my wishes
      if (wish.userId === getState().global.currentUser.id) {
        dispatch(getMyWishes())
      } else {
        // update friend wishes
        dispatch(updateFriendProfile())  
      }        
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