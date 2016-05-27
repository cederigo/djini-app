import { connect } from 'react-redux'
import Swipeout from 'react-native-swipeout'
import React, {Component} from 'react'
import { 
  StyleSheet,
  View,
  TouchableHighlight,
  Text
} from 'react-native';

import PureListView from './PureListView'

//types
import {Wish} from '../lib/types'
import {fulfilled} from '../lib/wishUtil'

// actions
import {showWish, editWish, deleteWish} from '../actions/wishes'

class FriendIdeasList extends Component {

  props: {
    wishes: Array<Wish>
  }
  _innerRef: ?PureListView;

  constructor(props) {
    super(props)

    this._innerRef = null;

    this.renderRow = this.renderRow.bind(this);
    this.renderEmptyList = this.renderEmptyList.bind(this);
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
  
  _swipeoutBtns (wish) {
    //TODO icons instead of text
    const {dispatch} = this.props
    return [
      { 
        text: 'Delete',
        onPress: () => dispatch(deleteWish(wish)),
        type: 'delete'
      },
      {
        text: 'Edit',
        onPress: () => dispatch(editWish(wish))
      }
    ]
  }

  renderEmptyList() {
    return (
      <Text>Du hast noch keine Ideen erfasst</Text>
    );
  }

  renderRow (wish) {
    const {dispatch} = this.props
    return (
      <Swipeout right={this._swipeoutBtns(wish)} autoClose={true}>
        <TouchableHighlight onPress={() => dispatch(showWish(wish))}>
          <View style={styles.row}>
            <Text style={styles.text}>
              {wish.title + (fulfilled(wish) ? ' (geschenkt)' : '')}
            </Text>
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

export default connect()(FriendIdeasList)