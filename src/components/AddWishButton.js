import React, { 
  StyleSheet,
  Component,
  TouchableOpacity,
  Text
} from 'react-native';

import {Actions} from 'react-native-router-flux'

const styles = StyleSheet.create({
  button: {
    padding: 15
  },
  buttonText: {
    color: 'rgb(0, 122, 155)'
  }
})

export default class AddWishButton extends Component {
  render() {
    return (
      <TouchableOpacity
        onPress={Actions.wish}
        style={styles.button}>
        <Text style={styles.buttonText}>Neuen Wunsch erfassen</Text>
      </TouchableOpacity>
    )
  }
}