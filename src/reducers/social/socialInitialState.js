import {Record, OrderedMap} from 'immutable';

var InitialState = Record({
  isFetching: false,
  error: null,
  filterText: '',
  lastSavedAt: 0,
  favorites: OrderedMap(),
  contacts: OrderedMap() 
});

export default InitialState;
