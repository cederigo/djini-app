
import React from 'react';
import {StyleSheet} from 'react-native';
import DjiniButton from './DjiniButton'

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    padding: 5
  },
  icon: {
    color: 'rgb(101,103,255)',
    fontSize: 25
  }
})

export default function ListRowButton(props) {
  return (
    <DjiniButton 
      {...props} 
      style={[styles.button, props.style]}
      iconStyle={[styles.icon, props.iconStyle]}
    />
  )
}
