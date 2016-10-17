import { connect } from 'react-redux';
import React, {Component} from 'react'
import { StyleSheet, TouchableOpacity} from 'react-native';

import {User} from '../lib/types'
import {newWish} from '../actions/wishes'

class NewWishButton extends Component {
  props: {
    fromUser: User,
    toUser: User,
  }
  render() {
    const {dispatch, fromUser, toUser} = this.props

    return (
      <TouchableOpacity style={styles.container} onPress={() => dispatch(newWish(fromUser, toUser))}>
        {this.props.children}
      </TouchableOpacity>
    )
  }
}

NewWishButton.defaultProps = {
  text: 'Neuen Wunsch erfassen'
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  }
})

/**
 * Redux boilerplate
 */
function select(state) {
  return { 
    fromUser: state.global.currentUser
  };
}
export default connect(select)(NewWishButton)
