import {
  FEEDBACK_REQUEST,
  FEEDBACK_SUCCESS,
  FEEDBACK_FAILURE,
  ON_FEEDBACK_CHANGE
} from '../../lib/constants'

import InitialState from './feedbackInitialState';

const initialState = new InitialState;

export default function feedbackReducer(state = initialState, {type, payload}) {
  switch (type) {
    case FEEDBACK_REQUEST:
      return state.set('isFetching', true)
        .set('error', null)
    case FEEDBACK_SUCCESS:
      return state.set('isFetching', false)
        .set('isValid', false)
        .set('description', '')
    case FEEDBACK_FAILURE:
      return state.set('isFetching', false)
        .set('error', payload)
    case ON_FEEDBACK_CHANGE:
      return state.set('description', payload)
        .set('isValid', payload ? true : false)
  }
  return state;
}
