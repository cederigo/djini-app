/* global setTimeout */
import { connect } from 'react-redux'
import React, {Component, PropTypes} from 'react'
import {StyleSheet} from 'react-native'

import DjiniText from './DjiniText'
import PureListView from './PureListView'
import ListRowSeperator from './ListRowSeperator'
import ListRow from './ListRow'
import ListRowIcon from './ListRowIcon'
import SwipeoutButton from './ListRowSwipeoutButton'

const styles = StyleSheet.create({
  favoriteIcon: {
    color: 'rgb(244, 230, 56)'
  },
  emptyList: {
    paddingHorizontal: 10,
    textAlign: 'center'
  }
})

// actions
import {showWish, deleteWish, saveWish} from '../actions/wishes'


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
        ref={this.storeInnerRef}
        data={this.props.wishes}
        renderRow={this.renderRow}
        renderSeparator={this.renderSeparator}
        renderEmptyList={this.renderEmptyList}
        renderHeader={() => <ListRowSeperator/>}
        {...this.props}
      />
    );
  }

  showSwipeoutAnimation (swipeout) {
    if (!swipeout) {
      return
    }
    swipeout.setState({btnWidth: 50, btnsRightWidth: 150})
    setTimeout(() => swipeout._tweenContent('contentPos', -150), 1500)
    setTimeout(() => swipeout._close(), 3000)
  }

  swipeoutBtns (wish) {
    const {dispatch} = this.props
    return [
      { 
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconName="delete"/>,
        onPress: () => dispatch(deleteWish(wish)),
      },
      {
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconStyle={wish.isFavorite ? styles.favoriteIcon : {}} iconName={wish.isFavorite ? 'star' : 'star-border'}/>,
        onPress: () => dispatch(saveWish(wish.set('isFavorite', !wish.isFavorite)))
      },
      {
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconName={wish.isPrivate ? 'lock' : 'lock-open'} />,
        onPress: () => dispatch(saveWish(wish.set('isPrivate', !wish.isPrivate)))
      }
    ]
  }

  renderRow (wish) {
    const {dispatch, showSwipeoutHint} = this.props
    return (
      <ListRow 
        title={wish.title}
        swipeoutBtns={this.swipeoutBtns(wish)}
        swipeoutRef={showSwipeoutHint ? this.showSwipeoutAnimation : undefined}
        onPress={() => dispatch(showWish(wish))}>
        {wish.isPrivate ? <ListRowIcon name="lock"/> : undefined}
        {wish.isFavorite ? <ListRowIcon style={styles.favoriteIcon} name="star"/> : undefined}
      </ListRow>
    )
  }

  renderEmptyList() {
    return (
      <DjiniText style={styles.emptyList}>Reibe an der Lampe und flüstere Djini deinen ersten Wunsch! Achtung: Wünsche können dank Djini in Erfüllung gehen! Djini haftet nicht für erfüllte Wünsche!</DjiniText>
    );
  }

  renderSeparator(sectionID, rowID) {
    return <ListRowSeperator key={"SEP_" + sectionID + "_" + rowID}/>
  }

  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref;
  }
}

export default connect()(MyWishList)
