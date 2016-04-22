import {Record, OrderedMap} from 'immutable';

var InitialState = Record({
    isFetching: false,
    error: null,
    wishes: OrderedMap()
})

export default InitialState;