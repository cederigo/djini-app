import {Record} from 'immutable';

const InitialState = Record({
  isValid: false,
  isFetching: false,
  error: null,
  user: null,
  fields: new (Record({
    name: '',
    email: '',
    birthday: ''
  }))
})

export default InitialState;