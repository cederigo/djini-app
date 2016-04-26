import { connect } from 'react-redux';
import React, {
  Component,
  View, Text, TouchableOpacity,
  StyleSheet
} from 'react-native';

import {logout} from '../actions/authActions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    padding: 15
  },
  buttonText: {
    color: 'rgb(0, 122, 155)'
  }
})

class Wishes extends Component {

  props: {
    user: any
  }

  render() {
    const {user} = this.props
    return (
        <View style={styles.container}>
          <Text>Willkommen {user.name}</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => { this.props.dispatch(logout())}}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
    )
  }
}

/**
 * Redux boilerplate
 */
function select(state) {
  return { user: state.global.currentUser};
}

export default connect(select)(Wishes)
