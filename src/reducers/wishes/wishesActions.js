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
} from '../../lib/constants'

/**
 * Project requirements
 */
import Parse from '../../lib/Parse'
import {Actions} from 'react-native-router-flux'

/*
 * Get user wishes
 */
export function getUserWishesRequest() {
  return {
    type: GET_USER_WISHES_REQUEST
  };
}

export function getUserWishesSuccess(wishes) {
  return {
    type: GET_USER_WISHES_SUCCESS,
    payload: wishes
  };
}

export function getUserWishesFailure() {
  return {
    type: GET_USER_WISHES_FAILURE
  };
}

export function getUserWishes() {
  console.log('wishesActions.getUserWishes');
  return (dispatch, getState) => {
    dispatch(getUserWishesRequest())
    
    return new Parse().getObjects('Wish', {   
      where: {
        owner: {
          __type: 'Pointer',
          className: '_User',
          objectId: getState().global.currentUser.objectId
        }
      } 
    })
    .then((response) => {
      dispatch(getUserWishesSuccess(response))
      //return response
    })
    .catch(error => {
      dispatch(getUserWishesFailure(error))
      //return Promise.reject(error)
    })
  }
}