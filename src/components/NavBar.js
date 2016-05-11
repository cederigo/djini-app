import {Actions} from 'react-native-router-flux';

import React, { 
  StyleSheet,
  Component,
  View,
  TouchableOpacity,
  Text
} from 'react-native';

export default class NavBar extends Component {
  render() {
    return (
      <View style={styles.navbar}>
         <TouchableOpacity 
            style={styles.button}
            onPress={Actions.pop}>
            <Text style={styles.buttonText}>Zurück</Text>
          </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  navbar: {
    marginTop: 20,
    height: 50,
  }
})