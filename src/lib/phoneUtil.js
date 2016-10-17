import {PhoneNumberFormat, PhoneNumberUtil, PhoneNumberType} from 'google-libphonenumber'
const phoneUtil = PhoneNumberUtil.getInstance()

export function isValidNumber(number, country = 'CH') {
  try {
    if (typeof number === 'string') {
      number = phoneUtil.parse(number, country)
    }
    return phoneUtil.isValidNumber(number)
  } catch (e) {
    return false
  }
}

export function formatNumber(number, country = 'CH', format = PhoneNumberFormat.INTERNATIONAL) {
  try {
    if (typeof number === 'string') {
      number = phoneUtil.parse(number, country)
    }
    return phoneUtil.format(number, format)
  } catch (e) {
    return ''
  }
}

export function isMobileNumber(number, country = 'CH') {
  try {
    if (typeof number === 'string') {
      number = phoneUtil.parse(number, country)
    }
    const numberType = phoneUtil.getNumberType(number)
    return numberType === PhoneNumberType.MOBILE || numberType === PhoneNumberType.FIXED_LINE_OR_MOBILE
  } catch (e) {
    return false
  }
}
