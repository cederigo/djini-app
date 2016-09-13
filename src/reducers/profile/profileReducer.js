import {Record} from 'immutable'
import InitialState from './profileInitialState'
import profileFormValidation from './profileFormValidation'

import {
  EDIT_PROFILE,
  CANCEL_EDIT_PROFILE,
  ON_PROFILE_FIELD_CHANGE,
  PROFILE_UPDATE_SUCCESS,
  PROFILE_UPDATE_REQUEST
} from '../../lib/constants'

const initialState = new InitialState;

export default function profileReduer(state = initialState, {type, payload}) {
  if (type === EDIT_PROFILE) {
    const {name, email, birthday} = payload
    return state
      .set('isValid', true)
      .set('isFetching', false)
      .set('user', payload)
      .set('edit', true)
      .set('fields', new (Record({name, email, birthday})))
  }
  else if (type == ON_PROFILE_FIELD_CHANGE) {
    const {field, value} = payload
    //clear error and set field value
    state = state.set('error', null)
      .setIn(['fields', field], value)
    return profileFormValidation(state)
  }
  else if (type === CANCEL_EDIT_PROFILE || type === PROFILE_UPDATE_SUCCESS) {
    return state.set('edit', false)
  }
  else if (type === PROFILE_UPDATE_REQUEST) {
    return state.set('isFetching', true)
  }
  return state
}
