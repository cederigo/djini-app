/* @flow */

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Immutable from 'immutable';
import React, {
  Component,
  View,
  PropTypes,
  StyleSheet,
  StatusBar,
  TextInput,
} from 'react-native';

import NoContactsPermission from '../components/NoContactsPermission'
import ContactsList from '../components/ContactsList'
import * as socialActions from '../actions/socialActions'


class Contacts extends Component {

  render() {
    const {socialState, actions} = this.props
    let {contacts, filterText} = socialState

    if (socialState.noContactsPermission) {
      return (<NoContactsPermission/>)
    }

    return (
        <View style={styles.container}>
          <StatusBar translucent={true} />
          <View style={styles.toolbar}>
            <TextInput
              onChangeText={(text) => actions.onSearchFieldChange(text)}
              style={styles.searchBar}
              placeholder="Kontakte suchen ..."
              value={filterText}
            />
          </View>
          <ContactsList contacts={contacts} actions={actions} filterText={filterText}/>
        </View>
    )
  }
}

Contacts.propTypes = {
  socialState: PropTypes.instanceOf(Immutable.Record).isRequired,
  actions: PropTypes.object.isRequired,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 50,
  },
  toolbar: {
    marginTop: 20,
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
  },
  searchBar: {
    height: 50,
  },
  list: {
    backgroundColor: 'white',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  rowText: {
    flex: 1,
  },
  rowActions: {
    width: 50,
    backgroundColor: 'red',
  },
})

/**
 * Redux boilerplate
 */
function mapStateToProps(state) {
  return { socialState: state.social};
}
function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(socialActions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Contacts)
