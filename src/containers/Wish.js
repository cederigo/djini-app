import { connect } from 'react-redux';
import Immutable from 'immutable';

import React, {Component, PropTypes} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import EditWishForm from '../components/wish/EditWishForm'
import ShowWishForm from '../components/wish/ShowWishForm'

//Actions
import {Actions} from 'react-native-router-flux';

class Wish extends Component {

  render() {
    const {wishState, globalState, dispatch} = this.props
    
    let WishForm
    if (wishState.editMode) {
      WishForm = <EditWishForm/>
    } else {
      WishForm = <ShowWishForm/>
    }
    
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        {WishForm}
      </View>
    )
  }
}

Wish.propTypes = {
  wishState: PropTypes.instanceOf(Immutable.Record).isRequired,
  globalState: PropTypes.instanceOf(Immutable.Record).isRequired
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
    globalState: state.global
  };
}

export default connect(select)(Wish)