import {List, Record, OrderedMap} from 'immutable'
import InitialState from './wishesInitialState'

/**
 * ## Wishes actions
 */
import {
    MY_PROFILE_REQUEST,
    MY_PROFILE_FAILURE,
    MY_PROFILE_LOADED,
    WISH_DELETED,
    WISH_ADDED,
    WISH_UPDATED,
} from '../../lib/constants'

import {Wish, Contact} from '../../lib/types'

import {isIdea} from '../../lib/wishUtil'

const initialState = new InitialState

function isParseObject(value) {
  return value && value.id
}

export function fromParseWish(parseWish, contacts: OrderedMap<Contact> = OrderedMap()): Record<Wish> {
  const fromUser = parseWish.get('fromUser')
  const toUser = parseWish.get('toUser')
  const fulfiller = parseWish.get('fulfiller')
  let fulfillerContact;
  if (isParseObject(fulfiller)) {
    console.log('fulfiller', fulfiller)
    fulfillerContact = contacts.get(fulfiller.get('username'))
  }
  //phoneNumber is stored in username attribute
  return new (Record({
    id: parseWish.id,
    title: parseWish.get('title'),
    description: parseWish.get('description'),
    url: parseWish.get('url'),
    seenAt: parseWish.get('seenAt'),
    isPrivate: parseWish.get('isPrivate'),
    isFavorite: parseWish.get('isFavorite'),
    createdAt: parseWish.get('createdAt'),
    fromUserId: fromUser ? fromUser.id || fromUser.objectId : undefined,
    toUserId: toUser ? toUser.id || toUser.objectId : undefined,
    fulfillerId: fulfiller ? fulfiller.id || fulfiller.objectId : undefined,
    fulfillerName: fulfillerContact ? fulfillerContact.name : undefined
  }))
}

function sortWishBy(wish) {
  const createdAt = wish.createdAt.getTime()
  return wish.isFavorite ? 'a' + createdAt : '' + createdAt
}

export default function wishesReducer(state = initialState, {type, payload}) {
  switch (type) {
    case MY_PROFILE_REQUEST:
      return state.set('isFetching', true)

    case MY_PROFILE_FAILURE:
      return state.set('isFetching', false)
        .set('error', payload)

    case MY_PROFILE_LOADED:
      return state.set('isFetching', false)
        .set('error', null)
        .set('wishes', List(payload.wishes.map((wish) => fromParseWish(wish))))

    case WISH_ADDED: {
      const wishes = state.get('wishes')
      const wish = fromParseWish(payload)
      if (isIdea(wish)) {
        // nothing to do
        return state   
      }
      return state.set('wishes', wishes.push(wish).sortBy(sortWishBy).reverse()) //add
    }

    case WISH_UPDATED: {
      const wishes = state.get('wishes')
      const wish = fromParseWish(payload)
      let idx = wishes.findIndex((w) => w.id === wish.id)
      if (isIdea(wish) || idx === -1) {
        // nothing to do
        return state   
      }
      return state.set('wishes', wishes.update(idx, () => wish).sortBy(sortWishBy).reverse()) //update
    }

    case WISH_DELETED: {
      const wishes = state.get('wishes')
      let idx = wishes.findIndex((w) => w.id === payload.id)
      if (idx === -1) {
        return state; //no change
      }
      return state.set('wishes', wishes.delete(idx))
    }
  }
  /**
   * ## Default
   */
  return state
}