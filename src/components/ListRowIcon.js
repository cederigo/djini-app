
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'

const styles = StyleSheet.create({
  container: {
    padding: 3
  },
  icon: {
    color: 'white',
    fontSize: 28
  }
})

export default function ListRowIcon(props) {
  return (
    <View style={styles.container}>
      <Icon {...props} style={[styles.icon, props.style]}/>
    </View>
  )
}
