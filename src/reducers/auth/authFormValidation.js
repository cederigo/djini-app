
import {isValidNumber, formatNumber} from '../../lib/phoneUtil'
import {
  LOGIN_PHONENUMBER_FORM,
  LOGIN_VERIFICATIONCODE_FORM,
  LOGIN_BIRTHDAY_FORM,
  LOGIN_PROFILE_FORM
} from '../../lib/constants'

export default function authFormValidation(state) {

  const {formName, fields} = state
  const {phoneNumber, code, email, name} = fields

  switch (formName) {
    case LOGIN_BIRTHDAY_FORM: 
      return state.set('isValid', true)
    case LOGIN_PHONENUMBER_FORM: 
      return state.set('isValid', isValidNumber(phoneNumber))
          .setIn(['fields', 'phoneNumberFormatted'], formatNumber(phoneNumber))
    case LOGIN_VERIFICATIONCODE_FORM:
      return state.set('isValid', code ? true : false)
    case LOGIN_PROFILE_FORM: {
      const isValidEmail = /.+@.+/.test(email)
      return state.set('isValid', name && isValidEmail)
    }
  }
}
