import {Record, OrderedMap} from 'immutable';

var InitialState = Record({
  isFetching: false,
  error: null,
  filterText: '',
  lastSavedAt: 0,
  permissionDenied: false,
  contacts: OrderedMap(),
});

export default InitialState;
