import { connect } from 'react-redux'
import Swipeout from 'react-native-swipeout'
import React, {Component} from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { 
  View,
  TouchableHighlight,
  Text
} from 'react-native';

import PureListView from './PureListView'

import {Wish, User} from '../lib/types'
import styles from '../lib/listStyles'

import {fulfilled, fulfilledByUser} from '../lib/wishUtil'

// actions
import {showWish, copyWish} from '../actions/wishes'

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

  renderRowDescription (wish, user) {
    if (!fulfilled(wish)) {
      return //nothing to render
    }

    let description = 'Wird erfüllt'
    if (fulfilledByUser(wish, user)) {
      description = 'Wird von mir erfüllt'
    }
    else if (wish.fulfillerName) {
      description = `Wird erfüllt durch ${wish.fulfillerName}`
    }
    return (
      <Text style={styles.rowDescription}>
        {description}
      </Text>
    )
  }

  swipeoutBtns (wish) {
    const {dispatch, user} = this.props
    return [
      { 
        component:
          <View style={styles.swipeout}>
            <Icon style={styles.swipeoutIcon} name="playlist-add" size={30}/>
          </View>,
        onPress: () => dispatch(copyWish(wish, user)),
      },
    ]
  }

  renderRow (wish) {
    const {dispatch, user} = this.props
    return (
      <Swipeout right={this.swipeoutBtns(wish)} autoClose={true}>
        <TouchableHighlight onPress={() => dispatch(showWish(wish, 'friend'))}>
          <View style={styles.row}>
            <View style={styles.col}>
              <Text style={[styles.rowText, {flex: 0}]} numberOfLines={1}>
                {wish.title}
              </Text>
              {this.renderRowDescription(wish, user)}
            </View>
            {fulfilled(wish) ? <Icon style={styles.rowIcon} name="check" size={30}/> : undefined}
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  }

  renderEmptyList() {
    return (
      <Text style={styles.emptyList}>Dein Freund hat noch keine Wünsche erfasst</Text>
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

export default connect()(FriendWishesList)