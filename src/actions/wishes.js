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
  GET_USER_WISHES_FAILURE 
} from '../lib/constants'

/**
 * Project requirements
 */
import Parse from 'parse/react-native'
import {Actions} from 'react-native-router-flux'
import {Immutable, List, Record} from 'immutable'

const Wish = Record({
  title: '',
  url: '',
  description: '',
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
  console.log(wishes)
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
  console.log('get user wishes')
  let wishes
  return (dispatch, getState) => {
    dispatch(getUserWishesRequest())
    let query = new Parse.Query('Wish')
    const userPointer = {
      __type: 'Pointer',
      className: '_User',
      objectId: getState().global.currentUser.objectId
    }
    query.equalTo('user', userPointer)
    return query.find()
    .then((response) => {
      wishes = List(response.map((wish) => {
        console.log('wish.attributes')
        console.log(wish.attributes)
        return new Wish({
          title: wish.attributes.title,
          url: wish.attributes.url,
          description: wish.attributes.description,
          userId: '', // TODO
          ownerId: '' // TODO
        })
      }))
      console.log(wishes)
      dispatch(getUserWishesSuccess(wishes))
    })
    .catch(error => {
      dispatch(getUserWishesFailure(error))
    })
  }
}