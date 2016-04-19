import {Record, Map} from 'immutable';

var InitialState = Record({
  isFetching: false,
  error: null,
  friends: Map()
});

export default InitialState;
