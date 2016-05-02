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
  GET_WISHES_REQUEST,
  GET_WISHES_SUCCESS, 
  GET_WISHES_FAILURE,
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
  private: false,
  userId: '',
  ownerId: ''
})

/*
 * Get wishes
 */
export function getWishesRequest() {
  return {
    type: GET_WISHES_REQUEST
  }
}

export function getWishesSuccess(wishes) {
  return {
    type: GET_WISHES_SUCCESS,
    payload: wishes
  }
}

export function getWishesFailure() {
  return {
    type: GET_WISHES_FAILURE
  }
}

export function getCurrentUserWishes() {
  return (dispatch, getState) => {
    dispatch(getWishes(getState().global.currentUser.id))
  }
}

export function getWishes(userId) {
  let wishes
  return (dispatch, getState) => {
    dispatch(getWishesRequest())
    let query = new Parse.Query('Wish')
    query.equalTo('user', parseUserPointer(userId))
    query.equalTo('owner', parseUserPointer(getState().global.currentUser.id))
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
      dispatch(getWishesSuccess(wishes))
    })
    .catch(error => {
      dispatch(getWishesFailure(error))
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

// user.id or user.phoneNumber must be set
export function newWish(user) {
  return (dispatch, getState) => {
    dispatch(resetWish())
    if (user.id) {
      dispatch(onWishFieldChange('userId', user.id))
    } else {
      dispatch(onWishFieldChange('userPhoneNumber', user.phoneNumber))
    }
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
      // make sure user exists
      _getUserId(wish)
      .then((userId) => {
        console.log('add wish for user ' + userId)
        let ParseWish = Parse.Object.extend('Wish')
        let newParseWish = new ParseWish({
          title: wish.title, 
          description: wish.description, 
          url: wish.url,
          private: wish.private,
          user: parseUserPointer(userId),
          owner: parseUserPointer(getState().global.currentUser.id)
        })
        return newParseWish.save()
      })
      .then((response) => {
        dispatch(saveWishSuccess())
        // update my wishes
        if (wish.ownerId === getState().global.currentUser.id) {
          dispatch(getCurrentUserWishes())
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

// make sure user exists
function _getUserId(wish) {
  if (wish.userId) {
    // user exists on parse
    return Parse.Promise.as(wish.userId)
  }
  // user might exist on parse
  const phoneNumber = wish.userPhoneNumber
  let query = new Parse.Query(Parse.User)
  query.equalTo('username', phoneNumber)
  return query.first()
  .then((user) => {
    if (!user) {
      // user does not exist on parse => add as new user
      console.log('no user with username ' + phoneNumber + ' found!')
      
      // TODO: this should be done on parse because of the secretPasswordToken
      const secretPasswordToken = 'NOTAREALTOKEN' // just for testing
      var user = new Parse.User()
      user.setUsername(phoneNumber)
      user.setPassword(secretPasswordToken)
      return user.save()
      .then((_user) => {
        console.log(_user.id)
        return _user.id 
      })
      
      //return Parse.Cloud.run('addUser', {phoneNumber})
    }
    // user exists on parse
    return user.id
  })
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
      parseWish.set('private', wish.private)
      return parseWish.save()
    })
    .then((response) => {
      dispatch(saveWishSuccess())
      // update my wishes
      if (wish.ownerId === getState().global.currentUser.id) {
        dispatch(getCurrentUserWishes())
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
        dispatch(getCurrentUserWishes())
      }
    })
    .catch((error) => {
      dispatch(saveWishSuccess(error))
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