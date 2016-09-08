/* global setTimeout */
import { connect } from 'react-redux'
import Swipeout from 'react-native-swipeout'
import Icon from 'react-native-vector-icons/MaterialIcons'
import React, {Component, PropTypes} from 'react'
import {View, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import DjiniText from './DjiniText'

import styles from '../lib/listStyles'

// actions
import {showWish, deleteWish, saveWish} from '../actions/wishes'

import PureListView from './PureListView'

class MyWishList extends Component {

  static propTypes = {
    showSwipeoutHint: PropTypes.bool.isRequired,
    wishes: PropTypes.arrayOf(PropTypes.object).isRequired
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
        backgroundColor: 'transparent',
        component:
          <View style={styles.swipeout}>
            <Icon style={styles.swipeoutIcon} name="delete" size={30}/>
          </View>,
        onPress: () => dispatch(deleteWish(wish)),
      },
      {
        backgroundColor: 'transparent',
        component: 
          <View style={styles.swipeout}>
            <Icon style={styles.swipeoutIcon} name={wish.isFavorite ? 'star' : 'star-border'} size={30}/>
          </View>,
        onPress: () => dispatch(saveWish(wish.set('isFavorite', !wish.isFavorite)))
      },
      {
        backgroundColor: 'transparent',
        component: 
          <View style={styles.swipeout}>
            <Icon style={styles.swipeoutIcon} name={wish.isPrivate ? 'lock' : 'lock-open'} size={30}/>
          </View>,
        onPress: () => dispatch(saveWish(wish.set('isPrivate', !wish.isPrivate)))
      }
    ]
  }

  renderRow (wish) {
    const {dispatch, showSwipeoutHint} = this.props
    return (
      <Swipeout style={styles.container} right={this.swipeoutBtns(wish)} ref={showSwipeoutHint ? this.showSwipeoutAnimation : undefined} autoClose={true}>
        <TouchableOpacity onPress={() => dispatch(showWish(wish))}>
          <View style={styles.row}>
            <DjiniText style={styles.rowText} numberOfLines={1}>
              {wish.title}
            </DjiniText>
            {wish.isPrivate ? <Icon style={styles.rowIcon} name="lock"/> : undefined}
            {wish.isFavorite ? <Icon style={styles.rowIconFavorite} name="star"/> : undefined}
          </View>
        </TouchableOpacity>
      </Swipeout>
    );
  }

  renderEmptyList() {
    return (
      <DjiniText style={styles.emptyList}>Flüstere Djini deinen ersten Wunsch! Achtung: Wünsche können dank Djini in Erfüllung gehen! Djini haftet nicht für erfüllte Wünsche!</DjiniText>
    );
  }

  renderSeparator(sectionID, rowID) {
    return (
      <View key={"SEP_" + sectionID + "_" + rowID}  style={styles.rowSeparator}>
        <LinearGradient key={"SEP_" + sectionID + "_" + rowID}
          style={styles.container}
          start={[0,0]}
          end={[1,0]}
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
        />
      </View>
    );
  }

  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref;
  }
}

export default connect()(MyWishList)
