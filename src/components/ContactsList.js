import Immutable from 'immutable'
import { connect } from 'react-redux'
import dismissKeyboard from 'dismissKeyboard'
import React, {Component, PropTypes} from 'react';
import {StyleSheet, View, ListView, TouchableHighlight, TouchableOpacity, Text, RefreshControl} from 'react-native';
import Swipeout from 'react-native-swipeout'

import {
  toggleFavorite,
  invite,
  loadFriendProfile,
  onSearchFieldChange,
  refreshContacts
} from '../actions/contacts'

class ContactsList extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2,
      sectionHeaderHasChanged: (s1, s2) => s1 != s2
    })

    this._renderRow = this._renderRow.bind(this)
    this._onRefresh = this._onRefresh.bind(this)

    this.state = {
      dataSource: ds.cloneWithRowsAndSections(this._getListViewData(this.props)),
      refreshing: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filterText !== this.props.filterText || nextProps.contacts !== this.props.contacts) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRowsAndSections(this._getListViewData(nextProps)),
        refreshing: false
      })
      this.refs.listView.scrollTo({animated: false})
    }
  }

  render() {
    return (
      <ListView
        ref="listView"
        style={styles.container}
        dataSource={this.state.dataSource}
        scrollRenderAheadDistance={2000}
        keyboardShouldPersistTaps={true}
        keyboardDismissMode="on-drag"
        pageSize={5}
        renderRow={this._renderRow}
        renderSeparator={this._renderSeparator}
        renderSectionHeader={this._renderSectionHeader}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
      />
    )
  }

  _onRefresh() {
    const {dispatch} = this.props
    this.setState({refreshing: true})
    dispatch(refreshContacts('user'))
  }

  _getListViewData(props) {
    const {filterText, contacts} = props
    const r = new RegExp(filterText, 'i')

    var data = {'Favoriten': [], 'Kontakte': []}

    contacts.forEach(contact => {
      if (r.test(contact.name)) {
        data[contact.isFavorite ? 'Favoriten' : 'Kontakte'].push(contact)
      }
    })

    return data
  }

  _swipeoutBtns (contact) {
    //TODO icons instead of text
    const {dispatch} = this.props
    return [
      {
        text: contact.isFavorite ? 'Not a Fav.' : 'Favorite', 
        onPress: () => {
          dispatch(toggleFavorite(contact))
          dispatch(onSearchFieldChange('')) //clear search
        }
      }
    ]
  }

  showContact(contact) {
    const {dispatch} = this.props
    dispatch(loadFriendProfile(contact))
    dismissKeyboard()
  }

  _renderRow (contact) {

    const {dispatch} = this.props

    return (
      <Swipeout right={this._swipeoutBtns(contact)} autoClose={true}>
        <TouchableHighlight onPress={() => this.showContact(contact)}>
          <View style={styles.row}>
            <Text style={styles.text}>
              {contact.name}
            </Text>
            {contact.registered ? null : 
              <TouchableOpacity style={styles.actions} onPress={() => dispatch(invite(contact))}>
                <Text>Invite</Text>
              </TouchableOpacity>
            }
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  }

  _renderSectionHeader(data, sectionId) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{sectionId}</Text>
      </View>
    );
  }

  _renderSeparator(sectionID, rowID) {
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={styles.rowSeparator}/>
    );
  }
}

ContactsList.propTypes = {
  contacts: PropTypes.instanceOf(Immutable.OrderedMap).isRequired,
  filterText: PropTypes.string
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingLeft: 10,
    backgroundColor: '#F6F6F6',
    height: 60,
    padding: 10
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginHorizontal: 10,
  },
  sectionHeader: {
    backgroundColor: '#48D1CC',
    paddingLeft: 10
  },
  sectionHeaderText: {
    fontSize: 16,
    color: 'white',
  },
  text: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold'
  },
  actions: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default connect()(ContactsList)
