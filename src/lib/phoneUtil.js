
import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber'

const phoneUtil = PhoneNumberUtil.getInstance()

export function phoneNumberValidation(state, action) {
  const number = action.payload
  const country = 'CH' //TODO get country from state (support multiple countries)
  let numberProto
  let isValid = false
  try {
    numberProto = phoneUtil.parse(number, country)
    isValid = phoneUtil.isValidNumber(numberProto)
  } catch (e) {
    //nothing to do
  }

  return state.set('isValid', isValid)
    .set('isPristine', number.length ? false : true)
    .setIn(['fields', 'phoneNumber'], number)
    .setIn(['fields', 'phoneNumberFormatted'], isValid ? phoneUtil.format(numberProto, PhoneNumberFormat.INTERNATIONAL) : '')
}
