import {List, Record} from 'immutable'
import InitialState from './wishesInitialState'

/**
 * ## Wishes actions
 */
import {
    MY_PROFILE_LOADED,
    SAVE_WISH_SUCCESS,
    WISH_DELETED,
} from '../../lib/constants'

import {Wish} from '../../lib/types'

import {isIdea} from '../../lib/wishUtil'

const initialState = new InitialState

export function fromParseWish(parseWish): Record<Wish> {
  let fullfiller = parseWish.get('fullfiller')
  let fromUser = parseWish.get('fromUser')
  let toUser = parseWish.get('toUser')
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
    fullfillerId: fullfiller ? fullfiller.id || fullfiller.objectId : undefined
  }))
}

function sortWishBy(wish) {
  const createdAt = wish.createdAt.getTime()
  return wish.isFavorite ? 'a' + createdAt : '' + createdAt
}

export default function wishesReducer(state = initialState, {type, payload}) {
  switch (type) {
    case MY_PROFILE_LOADED:
      return state.set('isFetching', false)
        .set('error', null)
        .set('wishes', List(payload.wishes.map(fromParseWish)))

    case SAVE_WISH_SUCCESS: {
      const wishes = state.get('wishes')
      const wish = fromParseWish(payload)
      if (isIdea(wish)) {
        // nothing to do
        return state   
      }
      // Add/update wish to my profile
      let idx = wishes.findIndex((w) => w.id === wish.id)
      if (idx === -1) {
        return state.set('wishes', wishes.push(wish).sortBy(sortWishBy).reverse()) //add
      } else {
        return state.set('wishes', wishes.update(idx, () => wish).sortBy(sortWishBy).reverse()) //update
      }
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