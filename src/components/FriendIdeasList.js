import { connect } from 'react-redux'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StyleSheet, View } from 'react-native'

import DjiniText from './DjiniText'
import DjiniButton from '../components/DjiniButton'
import PureListView from './PureListView'
import ListRowSeperator from './ListRowSeperator'
import ListRow from './ListRow'
import ListRowIcon from './ListRowIcon'
import SwipeoutButton from './ListRowSwipeoutButton'

import { newWish, copyWish, showWish, deleteWish, toggleFulfilled } from '../actions/wishes'

import { fulfilled } from '../lib/wishUtil'
import { trackScreenView } from '../lib/analytics'

const styles = StyleSheet.create({
  empty: {
    padding: 25
  },
  emptyText: {},
  emptyButton: {
    marginVertical: 25
  },
  newButton: {
    marginHorizontal: 25,
    marginVertical: 10
  }
})

class FriendIdeasList extends Component {
  static propTypes = {
    wishes: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired, // me
    friend: PropTypes.object.isRequired,
    contact: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this._innerRef = null

    this.renderRow = this.renderRow.bind(this)
    this.renderEmptyList = this.renderEmptyList.bind(this)
    this.storeInnerRef = this.storeInnerRef.bind(this)
  }

  componentDidMount() {
    trackScreenView('friend ideas')
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
    )
  }

  _swipeoutBtns(wish) {
    const { dispatch, user, contact } = this.props
    return [
      {
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconName="delete" />,
        onPress: () => dispatch(deleteWish(wish))
      },
      {
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconName="playlist-add" />,
        onPress: () => dispatch(copyWish(wish, user))
      },
      {
        backgroundColor: 'transparent',
        component: <SwipeoutButton iconName={fulfilled(wish) ? 'clear' : 'check'} />,
        onPress: () => dispatch(toggleFulfilled(wish, contact))
      }
    ]
  }

  renderEmptyList() {
    const { dispatch, user, friend, contact } = this.props
    return (
      <View style={styles.empty}>
        <DjiniText style={styles.emptyText}>
          {`Merke dir Geschenkideen f??r ${contact.name}`}
        </DjiniText>
        <DjiniButton
          style={styles.emptyButton}
          caption="Idee erfassen"
          onPress={() => dispatch(newWish(user, friend, 'friend'))}
        />
      </View>
    )
  }

  renderRow(wish) {
    const { dispatch, contact } = this.props
    return (
      <ListRow
        swipeoutBtns={this._swipeoutBtns(wish)}
        title={wish.title}
        onPress={() => dispatch(showWish(wish, 'friend', contact))}
      >
        {fulfilled(wish) ? <ListRowIcon name="check" /> : undefined}
      </ListRow>
    )
  }

  renderSeparator(sectionID, rowID) {
    return <ListRowSeperator key={'SEP_' + sectionID + '_' + rowID} />
  }

  storeInnerRef(ref: ?PureListView) {
    this._innerRef = ref
  }
}

export default connect()(FriendIdeasList)
