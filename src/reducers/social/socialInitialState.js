import {Record, Map} from 'immutable';

var InitialState = Record({
  isFetching: false,
  error: null,
  filterText: '',
  friends: Map()
});

export default InitialState;
