import { connect } from 'react-redux'
import React, {Component, PropTypes} from 'react'
import { StyleSheet, View } from 'react-native';

import DjiniText from './DjiniText'
import DjiniButton from '../components/DjiniButton'
import PureListView from './PureListView'
import ListRowSeperator from './ListRowSeperator'
import ListRow from './ListRow'
import ListRowIcon from './ListRowIcon'
import SwipeoutButton from './ListRowSwipeoutButton'

import {newWish} from '../actions/wishes'

import {fulfilled} from '../lib/wishUtil'

const styles = StyleSheet.create({
  empty: {
    padding: 25
  },
  emptyText: {
  },
  emptyButton: {
    marginVertical: 25
  }
})

// actions
import {showWish, deleteWish, fulfillWish, saveWish} from '../actions/wishes'

class FriendIdeasList extends Component {

  static propTypes = {
    wishes: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired, // me
    friend: PropTypes.object.isRequired,
    contact: PropTypes.object.isRequired,
  }

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
        renderSeparator={this.renderSeparator}
        {...this.props}
      />
    );
  }

  toggleFulfilled(wish) {
    const {dispatch, contact} = this.props
    if (fulfilled(wish)) {
      dispatch(saveWish(wish.set('fulfillerId', null)))
    } else {
      dispatch(fulfillWish(wish, contact))
    }
  }
  
  _swipeoutBtns (wish) {
    const {dispatch} = this.props
    return [
      { 
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconName="delete"/>,
        onPress: () => dispatch(deleteWish(wish)),
      },
      { 
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconName={fulfilled(wish) ? 'clear' : 'check'} />,
        onPress: () => this.toggleFulfilled(wish),
      }
    ]
  }

  renderEmptyList() {
    const {dispatch, user, friend} = this.props
    return (
      <View style={styles.empty}>
        <DjiniText style={styles.emptyText}>Du hast noch keine Ideen erfasst</DjiniText>
        <DjiniButton style={styles.emptyButton} caption="Idee erfassen" onPress={() => dispatch(newWish(user, friend, 'friend'))}/>
      </View>
    );
  }

  renderRow (wish) {
    const {dispatch, contact} = this.props
    return (
      <ListRow
        swipeoutBtns={this._swipeoutBtns(wish)}
        title={wish.title}
        onPress={() => dispatch(showWish(wish, 'friend', contact))}>
       {fulfilled(wish) ? <ListRowIcon name="check"/> : undefined}
      </ListRow>
    )
  }

  renderSeparator(sectionID, rowID) {
    return <ListRowSeperator key={"SEP_" + sectionID + "_" + rowID}/>
  }
  
  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref;
  }
}

export default connect()(FriendIdeasList)
