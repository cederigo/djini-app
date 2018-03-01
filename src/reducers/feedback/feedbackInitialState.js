import { Record } from 'immutable'

var InitialState = Record({
  isValid: false,
  isFetching: false,
  error: null,
  description: ''
})

export default InitialState
