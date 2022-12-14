import { connect } from 'react-redux'
import Immutable from 'immutable'

import PropTypes from 'prop-types'

import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

import WishView from '../components/WishView'
import WishEditView from '../components/WishEditView'

class Wish extends Component {
  static propTypes = {
    wishState: PropTypes.instanceOf(Immutable.Record).isRequired,
    source: PropTypes.string.isRequired
  }

  render() {
    const { wishState, source } = this.props
    const wish = source === 'friend' ? wishState.wishOfFriend : wishState.wish
    return (
      <View style={styles.container}>
        {wishState.editMode ? (
          <WishEditView
            {...this.props}
            wish={wish}
            source={source}
            isFetching={wishState.isFetching}
            error={wishState.error}
          />
        ) : (
          <WishView {...this.props} wish={wish} source={source} contact={wishState.contact} />
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

function select(state) {
  return {
    wishState: state.wish
  }
}
export default connect(select)(Wish)
