import {Record} from 'immutable';

import { LOGIN_PHONENUMBER_FORM } from '../../lib/constants'

const InitialState = Record({
  error: null,
  isValid: false,
  isFetching: false,
  formName: LOGIN_PHONENUMBER_FORM,
  fields: new (Record({
    phoneNumber: '',
    phoneNumberFormatted: '', //Properly formatted phone number
    code: '',
    name: '',
    email: '',
    birthday: undefined
  }))
});

export default InitialState;
