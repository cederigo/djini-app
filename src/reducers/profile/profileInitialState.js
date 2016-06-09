import {Record} from 'immutable';

const InitialState = Record({
  isValid: false,
  isFetching: false,
  error: null,
  user: null,
  fields: new (Record({
    name: '',
    email: '',
    birthday: Date(0) 
  }))
})

export default InitialState;