
import React from 'react';
import {StyleSheet, View} from 'react-native';
import DjiniIcon from './DjiniIcon'

const styles = StyleSheet.create({
  container: {
    padding: 3
  }
})

export default function ListRowIcon(props) {
  return (
    <View style={styles.container}>
      <DjiniIcon {...props} size={28}/>
    </View>
  )
}
