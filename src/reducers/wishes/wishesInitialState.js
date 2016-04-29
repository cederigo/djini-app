import {Record, List} from 'immutable'

var InitialState = Record({
    isFetching: false,
    error: null,
    wishes: List()
})

export default InitialState