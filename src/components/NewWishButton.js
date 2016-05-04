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
    user: User
  }
  render() {
    const {dispatch, user} = this.props
    return (
      <TouchableOpacity
        onPress={() => dispatch(newWish(user))}
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
    user: state.global.currentUser
  };
}
export default connect(select)(NewWishButton)