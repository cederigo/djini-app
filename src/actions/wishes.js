/**
 * # wishesActions.js
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
  SET_EDITABLE_FALSE,
  SET_WISH
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

export function setWish(wish) {
  return {
    type: SET_WISH,
    payload: wish
  }
}

export function setEditableFalse() {
  return {
    type: SET_EDITABLE_FALSE
  }
}

export function show(wish) {
  return dispatch => {
    dispatch(setEditableFalse())
    dispatch(setWish(wish))
    Actions.wish()
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