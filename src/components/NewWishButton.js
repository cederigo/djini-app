import { connect } from 'react-redux';
import React, {Component} from 'react'
import { StyleSheet } from 'react-native';

import WMButton from './WMButton'
import {User} from '../lib/types'
import {newWish} from '../actions/wishes'

class NewWishButton extends Component {
  props: {
    fromUser: User,
    toUser: User,
    text: string,
  }
  render() {
    const {dispatch, fromUser, toUser, style, text} = this.props
    
    return (
      <WMButton
        onPress={() => dispatch(newWish(fromUser, toUser))}
        style={[styles.button, style]}
        caption={text}
      />
    )
  }
}

NewWishButton.defaultProps = {
  text: 'Neuen Wunsch erfassen'
}

const styles = StyleSheet.create({
  button: {
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'rgb(0, 122, 155)'
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