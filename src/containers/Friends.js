/* @flow */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import React, {
  Component,
  View, Text,
  PropTypes,
  StyleSheet,
  Alert,
  StatusBar,
  TextInput
} from 'react-native';

import FriendsList from '../components/FriendsList'
import * as socialActions from '../reducers/social/socialActions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50
  },
  toolbar: {
    marginTop: 20,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD'
  },
  searchBar: {
    height: 50
  },
  list: {
    backgroundColor: 'white',
    flex: 1
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6'
  },
  rowText: {
    flex: 1
  },
  rowActions: {
    width: 50,
    backgroundColor: 'red'
  }
})

class Friends extends Component {

  constructor(props) {
    super(props);
    console.log('Friends.constructor() ')
  }

  _pressRow (friend) {
    Alert.alert('Friend pressed:', friend.name);
  }

  render() {
    console.log('Friends.render()')
    const {socialState, actions} = this.props
    let {friends, filterText} = socialState
    console.log('filterText: ', filterText)

    return (
        <View style={styles.container}>
          <StatusBar translucent={true} />
          <View style={styles.toolbar}>
            <TextInput
              onChangeText={(text) => actions.searchFriends(text)}
              style={styles.searchBar}
              placeholder="Freunde suchen ..."
              value={filterText}
            />
          </View>
          <FriendsList friends={friends} onPress={this._pressRow} filterText={filterText}/>
        </View>
    )
  }
}

Friends.propTypes = {
  socialState: PropTypes.instanceOf(Immutable.Record).isRequired,
  actions: PropTypes.object.isRequired
}

/**
 * Redux boilerplate
 */
function mapStateToProps(state) {
  return { socialState: state.social};
}
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(socialActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Friends)
