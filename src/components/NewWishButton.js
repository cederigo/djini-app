import React, { 
  StyleSheet,
  Component,
  TouchableOpacity,
  Text,
  PropTypes
} from 'react-native';

import {Actions} from 'react-native-router-flux'

export default class NewWishButton extends Component {
  render() {
    const {newWish, userId} = this.props
    return (
      <TouchableOpacity
        onPress={() => newWish()}
        style={styles.button}>
        <Text style={styles.buttonText}>Neuen Wunsch erfassen</Text>
      </TouchableOpacity>
    )
  }
}

NewWishButton.propTypes = {
  newWish: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  button: {
    padding: 15
  },
  buttonText: {
    color: 'rgb(0, 122, 155)'
  }
})