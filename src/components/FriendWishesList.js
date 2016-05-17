import { connect } from 'react-redux'
import React, {Component} from 'react'
import { 
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} from 'react-native';

import PureListView from './PureListView'

//types
import {Wish, User} from '../lib/types'

import {fulfilled, fulfilledByUser} from '../lib/wishUtil'

// actions
import {showWish} from '../actions/wishes'

class FriendWishesList extends Component {

  props: {
    wishes: Array<Wish>,
    user: User
  }
  _innerRef: ?PureListView;

  constructor(props) {
    super(props)

    this._innerRef = null;

    this.renderRow = this.renderRow.bind(this);
    this.storeInnerRef = this.storeInnerRef.bind(this);
  }
  
  render() {
    return (
      <PureListView
        ref={this.storeInnerRef}
        data={this.props.wishes}
        renderRow={this.renderRow}
        renderEmptyList={this.renderEmptyList}
        {...this.props}
      />
    );
  }

  renderTitle (wish, user) {
    if (!fulfilled(wish)) {
      return wish.title
    }
    else if (fulfilledByUser(wish, user)) {
      return wish.title + ' (erfüllt von mir)'
    }
    else if (wish.fulfillerName) {
      return wish.title + ` (erfüllt von ${wish.fulfillerName})`
    }
    else {
      return wish.title + ' (erfüllt)'
    }
  }

  renderRow (wish) {
    const {dispatch, user} = this.props
    return (
      <TouchableHighlight onPress={() => dispatch(showWish(wish))}>
        <View style={styles.row}>
          <Text style={styles.text}>
            {this.renderTitle(wish, user)}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={styles.rowSeparator}/>
    );
  }

  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref;
  }
}

// styles
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  text: {
    flex: 1,
    fontSize: 16,
  }
})

export default connect()(FriendWishesList)