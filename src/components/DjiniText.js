import React from 'react';
import {Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Asap',
    color: 'white',
    backgroundColor: 'transparent'
  },
  textItalic: {
    fontFamily: 'Asap-Italic',
    color: 'white'
  }
})

export default function DjiniText (props) {
  return (
    <Text {...props} style={[props.style, styles.textItalic]}>
      {props.children}
    </Text>
  )
}
