import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber'
const phoneUtil = PhoneNumberUtil.getInstance()

export function isValidNumber(number, country = 'CH') {
  try {
    let numberProto = phoneUtil.parse(number, country)
    return phoneUtil.isValidNumber(numberProto)
  } catch (e) {
    return false
  }
}

export function formatNumber(number, country = 'CH', format = PhoneNumberFormat.INTERNATIONAL) {
  try {
    let numberProto = phoneUtil.parse(number, country)
    return phoneUtil.format(numberProto, format)
  } catch (e) {
    return ''
  }
}
