import { connect } from 'react-redux';
import Immutable from 'immutable';

import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';

import WishView from '../components/wish/WishView'
import WishEditView from '../components/wish/WishEditView'

class Wish extends Component {

  render() {
    const {wishState} = this.props
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        {wishState.editMode ?
          <WishEditView wish={wishState.wish}/> :
          <WishView wish={wishState.wish}/>
        }
      </View>
    )
  }
}

Wish.propTypes = {
  wishState: PropTypes.instanceOf(Immutable.Record).isRequired
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

/**
 * Redux boilerplate
 */
function select(state) {
  return { 
    wishState: state.wish,
  };
}

export default connect(select)(Wish)