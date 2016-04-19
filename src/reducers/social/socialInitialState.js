import {Record, List} from 'immutable';

var Friend = Record({
  name: '',
  phoneNumber: '',
  phoneType: 'mobile',
  registered: false
})

var InitialState = Record({
  isFetching: false,
  error: null,
  contactsAccessAllowed: false,
  friends: List.of(Friend)
});

export default InitialState;
