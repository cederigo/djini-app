
import {isValidNumber, formatNumber} from '../../lib/phoneUtil'
import {
  LOGIN_PHONENUMBER_FORM,
  LOGIN_VERIFICATIONCODE_FORM,
  LOGIN_PROFILE_FORM
} from '../../lib/constants'

export default function authFormValidation(state) {

  const {formName, fields} = state
  const {phoneNumber, code, firstName, lastName, email} = fields

  switch (formName) {
    case LOGIN_PHONENUMBER_FORM: 
      return state.set('isValid', isValidNumber(phoneNumber))
          .setIn(['fields', 'phoneNumberFormatted'], formatNumber(phoneNumber))
    case LOGIN_VERIFICATIONCODE_FORM:
      return state.set('isValid', code ? true : false)
    case LOGIN_PROFILE_FORM: {
      return state.set('isValid', firstName && lastName && email)
    }
  }
}
