import React, {Component, PropTypes} from 'react';
import {View, TouchableHighlight, Text, RefreshControl} from 'react-native';
import Swipeout from 'react-native-swipeout'
import Icon from 'react-native-vector-icons/MaterialIcons'

import DjiniButton from './DjiniButton'
import PureListView from './PureListView'
import styles from '../lib/listStyles'

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
        style={styles.container}
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
    const {toggleFavorite} = this.props
    return [
      {
        component:
          <View style={styles.swipeout}>
            <Icon style={styles.swipeoutIcon} name={contact.isFavorite ? 'favorite-border' : 'favorite'} size={30}/>
          </View>,
        onPress: () => toggleFavorite(contact)
      }
    ]
  }

  renderRow (contact) {

    const {openContact, inviteContact} = this.props

    return (
      <Swipeout right={this.swipeoutBtns(contact)} autoClose={true}>
        <TouchableHighlight onPress={() => openContact(contact)}>
          <View style={styles.row}>
            <Text style={styles.rowText}>
              {contact.name}
            </Text>
            {contact.isFavorite ? <Icon style={styles.rowIcon} name="favorite" size={30}/> : undefined}
            {contact.registered ? undefined : <DjiniButton style={styles.rowButton} iconStyle={styles.rowButtonIcon} iconName="person-add" onPress={() => inviteContact(contact)}/>}
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={styles.rowSeparator}/>
    );
  }

  renderEmptyList() {
    return (<Text style={styles.emptyList}>Keine Kontakte gefunden</Text>)
  }

  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref;
  }

}
