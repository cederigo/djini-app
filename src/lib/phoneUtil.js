
import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber'

const phoneUtil = PhoneNumberUtil.getInstance()

export function phoneNumberValidation(state, action) {
  const {value} = action.payload
  const country = 'CH' //TODO get country from state (support multiple countries)
  let numberProto
  let isValid = false
  try {
    numberProto = phoneUtil.parse(value, country)
    isValid = phoneUtil.isValidNumber(numberProto)
  } catch (e) {
    //nothing to do
  }

  return state.set('isValid', isValid)
    .setIn(['fields', 'phoneNumber'], value)
    .setIn(['fields', 'phoneNumberFormatted'], isValid ? phoneUtil.format(numberProto, PhoneNumberFormat.INTERNATIONAL) : '')
}
