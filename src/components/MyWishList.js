import { connect } from 'react-redux'
import Swipeout from 'react-native-swipeout'
import Icon from 'react-native-vector-icons/MaterialIcons'
import React, {Component} from 'react'
import { 
  View,
  TouchableHighlight,
  Text
} from 'react-native';

import styles from '../lib/listStyles'

//types
import {Wish} from '../lib/types'

// actions
import {showWish, deleteWish, saveWish} from '../actions/wishes'

import PureListView from './PureListView'

class MyWishList extends Component {

  props: {
    showSwipeoutHint: bool,
    wishes: Array<Wish>
  }
  _innerRef: ?PureListView;

  constructor(props) {
    super(props)
    this.renderRow = this.renderRow.bind(this)
    this.swipeoutBtns = this.swipeoutBtns.bind(this)
    this.storeInnerRef = this.storeInnerRef.bind(this)
  }

  render() {
    return (
      <PureListView
        style={styles.container}
        ref={this.storeInnerRef}
        data={this.props.wishes}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        renderEmptyList={this.renderEmptyList}
        {...this.props}
      />
    );
  }

  showSwipeoutAnimation (swipeout) {
    if (!swipeout) {
      return
    }
    swipeout.setState({btnWidth: 50, btnsRightWidth: 150})
    setTimeout(() => swipeout._tweenContent('contentPos', -100), 1000)
    setTimeout(() => swipeout._close(), 1500)
  }

  swipeoutBtns (wish) {
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
            <Icon style={styles.swipeoutIcon} name={wish.isFavorite ? 'star-border' : 'star'} size={30}/>
          </View>,
        onPress: () => dispatch(saveWish(wish.set('isFavorite', !wish.isFavorite)))
      },
      {
        component: 
          <View style={styles.swipeout}>
            <Icon style={styles.swipeoutIcon} name={wish.isPrivate ? 'lock-open' : 'lock'} size={30}/>
          </View>,
        onPress: () => dispatch(saveWish(wish.set('isPrivate', !wish.isPrivate)))
      }
    ]
  }

  renderRow (wish) {
    const {dispatch, showSwipeoutHint} = this.props
    return (
      <Swipeout right={this.swipeoutBtns(wish)} ref={showSwipeoutHint ? this.showSwipeoutAnimation : undefined} autoClose={true}>
        <TouchableHighlight onPress={() => dispatch(showWish(wish))}>
          <View style={styles.row}>
            <Text style={styles.rowText} numberOfLines={1}>
              {wish.title}
            </Text>
            {wish.isPrivate ? <Icon style={styles.rowIcon} name="lock" size={30}/> : undefined}
            {wish.isFavorite ? <Icon style={styles.rowIcon} name="star" size={30}/> : undefined}
          </View>
        </TouchableHighlight>
      </Swipeout>
    );
  }

  renderEmptyList() {
    return (
      <Text style={styles.emptyList}>Flüstere Djini deinen ersten Wunsch! Achtung: Wünsche können dank Djini in Erfüllung gehen! Djini haftet nicht für erfüllte Wünsche!</Text>
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

export default connect()(MyWishList)