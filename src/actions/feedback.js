/*
 * @flow
 */

import Parse from 'parse/react-native'
import {Alert} from 'react-native'

import {
  FEEDBACK_REQUEST,
  FEEDBACK_SUCCESS,
  FEEDBACK_FAILURE,
  ON_FEEDBACK_CHANGE
} from '../lib/constants'

import {User} from '../lib/types'

const ParseFeedback = Parse.Object.extend('Feedback')
const ParseUser = Parse.Object.extend('User')

export function feedbackRequest() {
  return {type: FEEDBACK_REQUEST}
}

export function feedbackSuccess() {
  return {type: FEEDBACK_SUCCESS}
}

export function feedbackFailure(e) {
  return {type: FEEDBACK_FAILURE, payload: e}
}

export function sendFeedback(user: User, description: string) {
  return (dispatch) => {
    dispatch(feedbackRequest())

    const feedback = new ParseFeedback({
      user: ParseUser.createWithoutData(user.id),
      description
    })

    feedback.save()
      .then(() => {
        dispatch(feedbackSuccess())
        Alert.alert('Feedback', 'Merci für dein Feedback!')
      })
      .catch((e) => {
        dispatch(feedbackFailure(e))
        Alert.alert('Feedback', 'Sorry, dein Feedback konnte nicht übermittelt werden')
      })
  }
}

export function onFeedbackChange(text) {
  return {type: ON_FEEDBACK_CHANGE, payload: text}
}
