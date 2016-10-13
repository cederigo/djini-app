/* @flow */

import { connect } from 'react-redux'
import {Record} from 'immutable'
import React, {Component, PropTypes} from 'react'
import {View, StyleSheet} from 'react-native'
import dismissKeyboard from 'dismissKeyboard'

import {transliterate} from '../lib/transliteration'

import DjiniText from '../components/DjiniText'
import ContactsPermission from '../components/ContactsPermission'
import ContactsWizard from '../components/ContactsWizard'
import ContactsList from '../components/ContactsList'
import {SearchBar} from '../components/AppBar'

import {
  onSearchFieldChange,
  invite,
  setFavorite,
  refreshContacts,
  requestContactsPermission
} from '../actions/contacts'

import {loadFriendProfile} from '../actions/profile'

class Contacts extends Component {
  
  constructor(props) {
    super(props)
    console.log('Contacts.constructor()')
    this.state = {
      showSwipeoutHint: false
    }
  }

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
    dispatch(setFavorite(contact, !contact.isFavorite))
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
  
  requestPermission() {
    const {dispatch} = this.props
    dispatch(requestContactsPermission())
    // Disable atm.
    // this.setState({showSwipeoutHint: true})
  }
  
  refreshContacts() {
    const {dispatch} = this.props
    dispatch(refreshContacts())
  }

  render() {
    const {contactsState, dispatch} = this.props
    let {contacts, filterText, isFetching} = contactsState

    if (!isFetching && contactsState.permissionDenied) {
      return <ContactsPermission refreshContacts={() => this.refreshContacts()}/>
    }
    if (!isFetching && !contacts.size) {
      return <ContactsWizard requestPermission={() => this.requestPermission()}/>
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
        {isFetching ?
          <DjiniText style={styles.loading}>Laden..</DjiniText>
          : <ContactsList
            showSwipeoutHint={this.state.showSwipeoutHint}
            toggleFavorite={(c) => this.toggleFavorite(c)}
            openContact={(c) => this.openContact(c)}
            inviteContact={(c) => this.inviteContact(c)}
            refreshContacts={() => this.refreshContacts()}
            contacts={this.getListData(contacts, filterText)}/>
        }
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
  },
  loading: {
    marginTop: 50,
    textAlign: 'center'
  }
})

/**
 * Redux boilerplate
 */
function select(state) {
  return { contactsState: state.contacts};
}
export default connect(select)(Contacts)
