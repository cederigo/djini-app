import { connect } from 'react-redux'
import React, {Component, PropTypes} from 'react'
import { StyleSheet } from 'react-native';

import DjiniText from './DjiniText'
import PureListView from './PureListView'
import ListRowSeperator from './ListRowSeperator'
import ListRow from './ListRow'
import ListRowIcon from './ListRowIcon'
import SwipeoutButton from './ListRowSwipeoutButton'

const styles = StyleSheet.create({
  emptyList: {
    marginTop: 50,
    textAlign: 'center'
  }
})


import {fulfilled, fulfilledByUser} from '../lib/wishUtil'

// actions
import {showWish, copyWish} from '../actions/wishes'

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

  swipeoutBtns (wish) {
    const {dispatch, user} = this.props
    return [
      { 
        component: <SwipeoutButton name="playlist-add"/>,
        onPress: () => dispatch(copyWish(wish, user)),
      },
    ]
  }

  renderRow (wish) {
    const {dispatch, user, contact} = this.props
    return (
      <ListRow
        title={wish.title}
        description={this.getRowDescription(wish, user)}
        onPress={() => dispatch(showWish(wish, 'friend', contact))}>
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
