import {Record, OrderedMap} from 'immutable';

var InitialState = Record({
  isFetching: false,
  error: null,
  filterText: '',
  lastSavedAt: 0,
  pristine: true,
  permissionDenied: false,
  contacts: OrderedMap(),
});

export default InitialState;
