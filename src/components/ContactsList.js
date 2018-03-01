/* global setTimeout */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { RefreshControl, StyleSheet } from 'react-native'

import DjiniText from './DjiniText'
import PureListView from './PureListView'
import ListRowSeperator from './ListRowSeperator'
import ListRow from './ListRow'
import ListRowIcon from './ListRowIcon'
import SwipeoutButton from './ListRowSwipeoutButton'

const styles = StyleSheet.create({
  favoriteIcon: {
    color: 'rgb(239,71,98)'
  },
  emptyList: {
    marginTop: 100,
    textAlign: 'center'
  }
})

export default class ContactsList extends Component {
  _innerRef: ?PureListView

  static propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    openContact: PropTypes.func.isRequired,
    inviteContact: PropTypes.func.isRequired,
    refreshContacts: PropTypes.func.isRequired,
    showSwipeoutHint: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props)
    this.renderRow = this.renderRow.bind(this)
    this.onRefresh = this.onRefresh.bind(this)
    this.storeInnerRef = this.storeInnerRef.bind(this)
    this.state = {
      refreshing: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.contacts !== this.props.contacts) {
      this.setState({ refreshing: false })
      this._innerRef.scrollTo({ animated: false })
    }
  }

  showSwipeoutAnimation(swipeout) {
    if (!swipeout) {
      return
    }
    swipeout.setState({ btnWidth: 50, btnsRightWidth: 150 })
    setTimeout(() => swipeout._tweenContent('contentPos', -100), 2000)
    setTimeout(() => swipeout._close(), 4000)
  }

  render() {
    return (
      <PureListView
        initialListSize={10}
        ref={this.storeInnerRef}
        data={this.props.contacts}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        renderEmptyList={this.renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
        }
        {...this.props}
      />
    )
  }

  onRefresh() {
    const { refreshContacts } = this.props
    this.setState({ refreshing: true })
    refreshContacts()
  }

  swipeoutBtns(contact) {
    const { toggleFavorite, inviteContact } = this.props
    const result = [
      {
        backgroundColor: 'transparent',
        component: (
          <SwipeoutButton
            iconStyle={styles.favoriteIcon}
            iconName={contact.isFavorite ? 'favorite' : 'favorite-border'}
          />
        ),
        onPress: () => toggleFavorite(contact)
      }
    ]

    if (!contact.registered) {
      // Add at the beginning
      result.unshift({
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconName="person-add" />,
        onPress: () => inviteContact(contact)
      })
    }

    return result
  }

  renderRow(contact, section, idx) {
    const { openContact, showSwipeoutHint } = this.props
    const showSwipeoutAnimation = showSwipeoutHint && idx === '0'
    return (
      <ListRow
        title={contact.name}
        swipeoutRef={showSwipeoutAnimation ? this.showSwipeoutAnimation : undefined}
        swipeoutBtns={this.swipeoutBtns(contact)}
        onPress={() => openContact(contact)}
      >
        {contact.registered ? <ListRowIcon name="lamp_filled" size={40} /> : undefined}
        {contact.isFavorite ? (
          <ListRowIcon style={styles.favoriteIcon} name="favorite" />
        ) : (
          undefined
        )}
      </ListRow>
    )
  }

  renderSeparator(sectionID, rowID) {
    return <ListRowSeperator key={'SEP_' + sectionID + '_' + rowID} />
  }

  renderEmptyList() {
    return <DjiniText style={styles.emptyList}>Keine Kontakte gefunden</DjiniText>
  }

  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref
  }
}
