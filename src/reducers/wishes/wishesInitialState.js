import {Record, List} from 'immutable'

var InitialState = Record({
  isFetching: false,
  error: null,
  showSwipeoutHint: false,
  wishes: List()
})

export default InitialState