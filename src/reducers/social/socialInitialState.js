import {Record, Map} from 'immutable';

var InitialState = Record({
  isFetching: false,
  error: null,
  filterText: '',
  lastSavedAt: 0,
  friends: Map()
});

export default InitialState;
