import React from 'react';
import {Text, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Asap',
  }
})

export default function DjiniText (props) {
  return (
    <Text {...props} style={[props.style, styles.text]}>
      {props.children}
    </Text>
  )
}
