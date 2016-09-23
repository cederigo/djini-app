import Record from 'immutable'
import Parse from 'parse/react-native'
import {Actions} from 'react-native-router-flux'

import { Alert } from 'react-native';

import {fulfilled} from '../lib/wishUtil'

import {
  SAVE_WISH_REQUEST, 
  SAVE_WISH_FAILURE, 
  WISH_ADDED,
  WISH_UPDATED,
  WISH_DELETED,
  UPLOAD_WISH_IMAGE,
  ON_WISH_FIELD_CHANGE,
  SHOW_WISH,
  EDIT_WISH,
  NEW_WISH
} from '../lib/constants'

import {updateTaskNote, getTaskNote} from './notes'
import {setBadge} from './tabs'
import {fromParseWish} from '../reducers/wishes/wishesReducer'

const ParseWish = Parse.Object.extend('Wish')
const ParseUser = Parse.Object.extend('User')

function toParseWish(wish: Record<Wish>) {
  return new ParseWish({
    id: wish.id,
    title: wish.title,
    description: wish.description,
    price: wish.price ? Number(wish.price) : undefined,
    url: wish.url,
    seenAt: wish.seenAt,
    isPrivate: wish.isPrivate,
    isFavorite: wish.isFavorite,
    imageURL: wish.imageURL,

    fromUser: ParseUser.createWithoutData(wish.fromUserId),
    toUser: ParseUser.createWithoutData(wish.toUserId),
    fulfiller: wish.fulfillerId ? ParseUser.createWithoutData(wish.fulfillerId) : null
  })
}

import {Wish, User} from '../lib/types'

export function showWish(wish, source = 'wishes', contact) {
  return dispatch => {
    dispatch({type: SHOW_WISH, payload: {source, wish, contact}})
    if (source === 'wishes') {
      Actions.wish()
    } else {
      Actions.friendWish()
    }
  }
}

export function editWish(wish, source='wishes') {
  return dispatch => {
    dispatch({type: EDIT_WISH, payload: wish})
    if (source === 'wishes') {
      Actions.wish()
    } else {
      Actions.friendWish()
    }
  }
}

export function onWishFieldChange(field, value) {
  return {
    type: ON_WISH_FIELD_CHANGE,
    payload: {field, value}
  }
}

export function newWish(fromUser: User, toUser: User, source = 'wishes') {
  return dispatch => {
    dispatch({type: NEW_WISH, payload: {fromUser, toUser, source}})
    if (source === 'wishes') {
      Actions.wish({title: 'Wunsch erfassen'})
    } else {
      Actions.friendWish({title: 'Idee erfassen'})
    }
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
export function wishAdded(wish, source) {
  return {
    type: WISH_ADDED,
    payload: {wish, source}
  };
}
export function wishUpdated(wish, source) {
  return {
    type: WISH_UPDATED,
    payload: {wish, source}
  };
}
export function saveWishFailure(error) {
  return {
    type: SAVE_WISH_FAILURE,
    payload: error
  };
}
export function saveWish(wish: Record<Wish>, source: string = "details") {
  return dispatch => {
    dispatch(saveWishRequest())

    let parseWish = toParseWish(wish)

    return parseWish.save().then((data) => {
      if (wish.id) {
        dispatch(wishUpdated(data, source))
        dispatch(updateTaskNote(fromParseWish(data).toJS()))
      } else {
        if (source === 'details') {
          Actions.pop()
        }
        dispatch(wishAdded(data, source))
      }
    })
    .catch((error) => {
      dispatch(saveWishFailure(error))
    })
  }
}

export function deleteWish(wish: Wish, source: ?string = 'swipe') {
  return dispatch => {
    if (!wish.id) {
      //nothing to do
      return
    }

    function deleteConfirmed() {
      ParseWish.createWithoutData(wish.id).destroy()
        .then(() => {
          dispatch({type: WISH_DELETED, payload: wish})
          if (source === 'details') {
            Actions.pop() //go back
          }
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

export function fulfillWish(wishRecord, contact) {
  return dispatch => {
    const wish = wishRecord.toJS()
    const onConfirmed = () => {
      Actions.pop() // Lets be optimistic and close the dialog to get an immediate feedback
      dispatch(saveWishRequest())
      Parse.Cloud.run('fulfillWish', {wishId: wish.id})
      .then(data => {
        dispatch(wishUpdated(data))
        dispatch(setBadge('notesTab'))
      })
      .catch(error => {
        dispatch(saveWishFailure(error))
        if (error.message.code === 'Wish is already fulfilled.') {
          Alert.alert('Jemand war schneller', 'Dieser Wunsch ist schon erfüllt.')
        }
      })
    }
    // Show Note edit
    Actions.noteDialog({
      dispatch,
      edit: true,
      note: getTaskNote(contact, wish),
      onSave: onConfirmed,
      saveText: 'Erfüllen'
    })
  }
}

export function uploadWishImage(base64Data) {
  return dispatch => {
    dispatch({type: UPLOAD_WISH_IMAGE})
    const imageFile = new Parse.File('wish-image.jpg', {base64: base64Data})
    return imageFile.save()
      .then((uploadedFile) => dispatch(onWishFieldChange('imageURL', uploadedFile.url())))
  }
}

export function copyWish(wish: Record<Wish>, user: User) {
  return dispatch => {
    const copy = wish.merge({id: null, isFavorite: false, fromUserId: user.id, toUserId: user.id, fulfillerId: null})
    dispatch(saveWish(copy, 'copy'))
    dispatch(setBadge('wishesTab'))
  }
}

export function toggleFulfilled(wish, contact) {
  return (dispatch) => {
    if (fulfilled(wish)) {
      dispatch(saveWish(wish.set('fulfillerId', null)))
    } else {
      dispatch(fulfillWish(wish, contact))
    }
  }
}
