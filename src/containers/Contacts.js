/* @flow */

import { connect } from 'react-redux';
import Immutable from 'immutable';
import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, StatusBar, TextInput} from 'react-native';

import NoContactsPermission from '../components/NoContactsPermission'
import ContactsList from '../components/ContactsList'

import {onSearchFieldChange} from '../actions/contacts'

class Contacts extends Component {

  render() {
    const {contactsState, dispatch} = this.props
    let {contacts, filterText} = contactsState

    if (contactsState.noContactsPermission) {
      return (<NoContactsPermission/>)
    }

    return (
        <View style={styles.container}>
          <StatusBar translucent={true} />
          <View style={styles.toolbar}>
            <TextInput
              onChangeText={(text) => dispatch(onSearchFieldChange(text))}
              style={styles.searchBar}
              placeholder="Kontakte suchen ..."
              value={filterText}
            />
          </View>
          <ContactsList contacts={contacts} filterText={filterText}/>
        </View>
    )
  }
}

Contacts.propTypes = {
  contactsState: PropTypes.instanceOf(Immutable.Record).isRequired,
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
function select(state) {
  return { contactsState: state.contacts};
}
export default connect(select)(Contacts)
