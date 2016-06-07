import { connect } from 'react-redux'
import Swipeout from 'react-native-swipeout'
import Icon from 'react-native-vector-icons/MaterialIcons'
import React, {Component} from 'react'
import { 
  View,
  TouchableHighlight,
  Text
} from 'react-native';

import PureListView from './PureListView'

import {Wish} from '../lib/types'
import {fulfilled} from '../lib/wishUtil'
import styles from '../lib/listStyles'

// actions
import {showWish, deleteWish, fulfillWish, saveWish} from '../actions/wishes'

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

  toggleFulfilled(wish) {
    const {dispatch} = this.props
    if (fulfilled(wish)) {
      dispatch(saveWish(wish.set('fulfillerId', null)))
    } else {
      dispatch(fulfillWish(wish))
    }
  }
  
  _swipeoutBtns (wish) {
    const {dispatch} = this.props
    return [
      { 
        component:
          <View style={styles.swipeout}>
            <Icon style={styles.swipeoutIcon} name="delete" size={30}/>
          </View>,
        onPress: () => dispatch(deleteWish(wish)),
      },
      { 
        component:
          <View style={styles.swipeout}>
            <Icon style={styles.swipeoutIcon} name={fulfilled(wish) ? 'clear' : 'check'} size={30}/>
          </View>,
        onPress: () => this.toggleFulfilled(wish),
      }
    ]
  }

  renderEmptyList() {
    return (
      <Text style={styles.emptyList}>Du hast noch keine Ideen erfasst</Text>
    );
  }

  renderRow (wish) {
    const {dispatch} = this.props
    return (
      <Swipeout right={this._swipeoutBtns(wish)} autoClose={true}>
        <TouchableHighlight onPress={() => dispatch(showWish(wish))}>
          <View style={styles.row}>
            <Text style={styles.rowText}>
              {wish.title}
            </Text>
            {fulfilled(wish) ? <Icon style={styles.rowIcon} name="check" size={30}/> : undefined}
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

export default connect()(FriendIdeasList)