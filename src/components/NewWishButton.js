import { connect } from 'react-redux';
import React, { 
  StyleSheet,
  Component,
  TouchableOpacity,
  Text
} from 'react-native';

import {User} from '../lib/types'
import {newWish} from '../actions/wishes'

class NewWishButton extends Component {
  props: {
    fromUser: User,
    toUser: User
  }
  render() {
    const {dispatch, fromUser, toUser} = this.props
    return (
      <TouchableOpacity
        onPress={() => dispatch(newWish(fromUser, toUser))}
        style={styles.button}>
        <Text style={styles.buttonText}>Neuen Wunsch erfassen</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center'
      
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