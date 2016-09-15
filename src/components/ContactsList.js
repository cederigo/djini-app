import React, {Component, PropTypes} from 'react';
import {RefreshControl, StyleSheet} from 'react-native';

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

  _innerRef: ?PureListView;

  static propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.object).isRequired,
    toggleFavorite: PropTypes.func.isRequired,
    openContact: PropTypes.func.isRequired,
    inviteContact: PropTypes.func.isRequired,
    refreshContacts: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
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
      this._innerRef.scrollTo({animated: false})
    }
  }

  render() {
    return (
      <PureListView
        ref={this.storeInnerRef}
        data={this.props.contacts}
        keyboardShouldPersistTaps={true}
        keyboardDismissMode="on-drag"
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        renderEmptyList={this.renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        {...this.props}
      />
    )
  }

  onRefresh() {
    const {refreshContacts} = this.props
    this.setState({refreshing: true})
    refreshContacts()
  }

  swipeoutBtns (contact) {
    const {toggleFavorite, inviteContact} = this.props
    const result = [
      {
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconStyle={styles.favoriteIcon} iconName={contact.isFavorite ? 'favorite' : 'favorite-border'}/>,
        onPress: () => toggleFavorite(contact)
      },
    ]

    if (!contact.registered) {
      // Add at the beginning
      result.unshift({
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconName="person-add"/>,
        onPress: () => inviteContact(contact)
      })
    }

    return result
  }

  renderRow (contact) {
    const {openContact} = this.props
    return (
      <ListRow
        title={contact.name}
        swipeoutBtns={this.swipeoutBtns(contact)}
        onPress={() => openContact(contact)}>
        {contact.isFavorite ? <ListRowIcon style={styles.favoriteIcon} name="favorite"/> : undefined}
      </ListRow>
    );
  }

  renderSeparator(sectionID, rowID) {
    return <ListRowSeperator key={"SEP_" + sectionID + "_" + rowID}/>
  }

  renderEmptyList() {
    return <DjiniText style={styles.emptyList}>Keine Kontakte gefunden</DjiniText>
  }

  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref;
  }

}
