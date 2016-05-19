import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.8
  }
})

export default class Loading extends Component {
  render() {
    return (
        <View style={styles.container}>
          <Text>Laden...</Text>
        </View>
    )
  }
}
