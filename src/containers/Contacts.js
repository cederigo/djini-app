/* @flow */

import { connect } from 'react-redux'
import {Record} from 'immutable'
import React, {Component, PropTypes} from 'react'
import {View, StyleSheet} from 'react-native'
import dismissKeyboard from 'dismissKeyboard'

import {transliterate} from '../lib/transliteration'

import ContactsPermission from '../components/ContactsPermission'
import ContactsWizard from '../components/ContactsWizard'
import ContactsList from '../components/ContactsList'
import {SearchBar} from '../components/AppBar'

import {
  onSearchFieldChange,
  invite,
  toggleFavorite,
  refreshContacts
} from '../actions/contacts'

import {loadFriendProfile} from '../actions/profile'

class Contacts extends Component {

  endSearch() {
    const {dispatch} = this.props
    dispatch(onSearchFieldChange('')) //clear search
    this.refs.searchBar.endSearch()
  }

  getListData(contacts, filterText) {
    const r = new RegExp(transliterate(filterText), 'i')
    const result = {favorites: [], contacts: []}
    contacts.forEach(c => {
      if (!r.test(c.nameTransliterated)) {
        return;
      }
      result[c.isFavorite ? 'favorites' : 'contacts'].push(c)
    })
    return result.favorites.concat(result.contacts) //favorites first
  }

  toggleFavorite(contact) {
    const {dispatch} = this.props
    dispatch(toggleFavorite(contact))
    dispatch(onSearchFieldChange('')) //clear search
  }

  openContact(contact) {
    const {dispatch} = this.props
    dispatch(loadFriendProfile(contact))
    dismissKeyboard()
  }

  inviteContact(c) {
    const {dispatch} = this.props
    dispatch(invite(c))
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
        <SearchBar
          ref="searchBar"
          title="Freunde"
          inputValue={filterText}
          inputPlaceholder="Freunde suchen ..."
          onChangeText={(text) => dispatch(onSearchFieldChange(text))}
          onSearchEnd={() => this.endSearch()}/>
        <ContactsList
          toggleFavorite={(c) => this.toggleFavorite(c)}
          openContact={(c) => this.openContact(c)}
          inviteContact={(c) => this.inviteContact(c)}
          refreshContacts={() => dispatch(refreshContacts())}
          contacts={this.getListData(contacts, filterText)}/>
      </View>
    )
  }
}

Contacts.propTypes = {
  contactsState: PropTypes.instanceOf(Record).isRequired,
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
