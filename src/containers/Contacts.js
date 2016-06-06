/* @flow */

import { connect } from 'react-redux';
import Immutable from 'immutable';
import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';

import ContactsPermission from '../components/ContactsPermission'
import ContactsWizard from '../components/ContactsWizard'
import ContactsList from '../components/ContactsList'
import {SearchBar} from '../components/AppBar'

import {onSearchFieldChange} from '../actions/contacts'

class Contacts extends Component {

  endSearch() {
    const {dispatch} = this.props
    dispatch(onSearchFieldChange('')) //clear search
  }

  render() {
    const {contactsState, dispatch} = this.props
    let {contacts, filterText} = contactsState

    if (contactsState.permissionDenied) {
      return (<ContactsPermission/>)
    }

    if (!contacts.size) {
      return (<ContactsWizard/>)
    } 

    //contacts
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        <SearchBar 
          title="Freunde"
          inputValue={filterText}
          inputPlaceholder="Freunde suchen ..."
          onChangeText={(text) => dispatch(onSearchFieldChange(text))}
          onSearchEnd={() => this.endSearch()}/>
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
  }
})

/**
 * Redux boilerplate
 */
function select(state) {
  return { contactsState: state.contacts};
}
export default connect(select)(Contacts)
