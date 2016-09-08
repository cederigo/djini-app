import { connect } from 'react-redux'
import React, {Component, PropTypes} from 'react'
import { StyleSheet } from 'react-native';

import DjiniText from './DjiniText'
import PureListView from './PureListView'
import ListRowSeperator from './ListRowSeperator'
import ListRow from './ListRow'
import ListRowIcon from './ListRowIcon'
import SwipeoutButton from './ListRowSwipeoutButton'

import {fulfilled} from '../lib/wishUtil'

const styles = StyleSheet.create({
  emptyList: {
    marginTop: 50,
    textAlign: 'center'
  }
})

// actions
import {showWish, deleteWish, fulfillWish, saveWish} from '../actions/wishes'

class FriendIdeasList extends Component {

  static propTypes = {
    wishes: PropTypes.array.isRequired,
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
        renderSeparator={this.renderSeparator}
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
    return (
      <DjiniText style={styles.emptyList}>Du hast noch keine Ideen erfasst</DjiniText>
    );
  }

  renderRow (wish) {
    const {dispatch} = this.props
    return (
      <ListRow
        swipeoutBtns={this._swipeoutBtns(wish)}
        title={wish.title}
        onPress={() => dispatch(showWish(wish, 'friend'))}>
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
