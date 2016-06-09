import { connect } from 'react-redux';
import Immutable from 'immutable';

import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';

import WishView from '../components/wish/WishView'
import WishEditView from '../components/wish/WishEditView'

class Wish extends Component {

  static propTypes = {
    wishState: PropTypes.instanceOf(Immutable.Record).isRequired,
    source: PropTypes.string.isRequired
  }

  render() {
    const {wishState, source} = this.props
    const wish = source === 'friend' ? wishState.wishOfFriend : wishState.wish
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        {wishState.editMode ?
          <WishEditView wish={wish} source={source}/> :
          <WishView wish={wish} source={source}/>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

function select(state) {
  return { 
    wishState: state.wish,
  };
}
export default connect(select)(Wish)