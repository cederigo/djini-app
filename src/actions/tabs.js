import { CLEAR_BADGE, SET_BADGE } from '../lib/constants'

export function clearBadge(sceneKey) {
  return {
    type: CLEAR_BADGE,
    payload: sceneKey
  }
}

export function setBadge(sceneKey) {
  return {
    type: SET_BADGE,
    payload: sceneKey
  }
}
