import React from 'react'
import { View, StyleSheet } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
const styles = StyleSheet.create({
  container: {
    height: 2
  },
  gradient: {
    flex: 1,
    backgroundColor: 'transparent'
  }
})
export default function ListRowSeperator(props) {
  return (
    <View style={styles.container} {...props}>
      <LinearGradient
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
      />
    </View>
  )
}
