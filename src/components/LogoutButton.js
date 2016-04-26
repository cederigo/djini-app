import React, { 
  StyleSheet,
  Component,
  TouchableOpacity,
  Text
} from 'react-native';

import logout from '../reducers/auth/authActions'

const styles = StyleSheet.create({
  button: {
    padding: 15
  },
  buttonText: {
    color: 'rgb(0, 122, 155)'
  }
})

export default class LogoutButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={logout}
        style={styles.button}>
        <Text style={styles.buttonText}>LOGOUT</Text>
      </TouchableOpacity>
    )
  }
}