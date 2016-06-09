import {Record} from 'immutable'
import InitialState from './profileInitialState'
import profileFormValidation from './profileFormValidation'

import {
  EDIT_PROFILE,
  ON_PROFILE_FIELD_CHANGE
} from '../../lib/constants'

const initialState = new InitialState;

export default function profileReduer(state = initialState, {type, payload}) {
  if (type === EDIT_PROFILE) {
    const {name, email, birthday} = payload
    return state
      .set('isValid', true)
      .set('user', payload)
      .set('fields', new (Record({name, email, birthday})))
  }
  else if (type == ON_PROFILE_FIELD_CHANGE) {
    const {field, value} = payload
    //clear error and set field value
    state = state.set('error', null)
      .setIn(['fields', field], value)
    return profileFormValidation(state)
  }
  return state
}