import { connect } from 'react-redux'
import React, {Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet } from 'react-native';

import DjiniText from './DjiniText'
import PureListView from './PureListView'
import ListRowSeperator from './ListRowSeperator'
import ListRow from './ListRow'
import ListRowIcon from './ListRowIcon'
import SwipeoutButton from './ListRowSwipeoutButton'

import {fulfillable} from '../lib/wishUtil'

const styles = StyleSheet.create({
  emptyList: {
    marginTop: 50,
    textAlign: 'center'
  },
  favoriteIcon: {
    color: 'rgb(244, 230, 56)'
  }
})


import {fulfilled, fulfilledByUser} from '../lib/wishUtil'

// actions
import {showWish, copyWish, toggleFulfilled} from '../actions/wishes'

class FriendWishesList extends Component {

  static propTypes = {
    wishes: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired,
    contact: PropTypes.object.isRequired
  }

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
        renderSeparator={this.renderSeparator}
        {...this.props}
      />
    );
  }

  getRowDescription (wish, user) {
    if (!fulfilled(wish)) {
      return '' //nothing to render
    }
    if (fulfilledByUser(wish, user)) {
      return 'Wird von mir erfüllt'
    }
    else if (wish.fulfillerName) {
      return `Wird erfüllt durch ${wish.fulfillerName}`
    }
    return 'Wird erfüllt'
  }

  _swipeoutBtns (wish) {
    const {dispatch, user, contact} = this.props
    const result = [
      { 
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconName='playlist-add' />,
        onPress: () => dispatch(copyWish(wish, user))
      }
    ]
    if (fulfillable(wish, user)){
      result.push({ 
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconName={fulfilled(wish) ? 'clear' : 'check'} />,
        onPress: () => dispatch(toggleFulfilled(wish, contact)),
      })
    }
    return result
  }

  renderRow (wish) {
    const {dispatch, user, contact} = this.props
    return (
      <ListRow
        title={wish.title}
        swipeoutBtns={this._swipeoutBtns(wish)}
        description={this.getRowDescription(wish, user)}
        onPress={() => dispatch(showWish(wish, 'friend', contact))}>
       {wish.isFavorite ? <ListRowIcon style={styles.favoriteIcon} name="star"/> : undefined}
       {fulfilled(wish) ? <ListRowIcon name="check"/> : undefined}
      </ListRow>
    )
  }

  renderEmptyList() {
    return (
      <DjiniText style={styles.emptyList}>Dein Freund hat noch keine Wünsche erfasst</DjiniText>
    );
  }

  renderSeparator(sectionID, rowID) {
    return <ListRowSeperator key={"SEP_" + sectionID + "_" + rowID}/>
  }

  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref;
  }
}

export default connect()(FriendWishesList)
