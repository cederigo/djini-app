import {Record, OrderedMap} from 'immutable';

var InitialState = Record({
  isFetching: false,
  error: null,
  filterText: '',
  lastSavedAt: 0,
  noContactsPermission: false,
  contacts: OrderedMap(),
});

export default InitialState;
