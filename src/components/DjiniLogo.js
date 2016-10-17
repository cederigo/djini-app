import React from 'react';
import {StyleSheet, Image} from 'react-native';
import {djini_logo} from '../../img'

const styles = StyleSheet.create({
  logo: {
    // marginTop: 100,
    // marginBottom: 70,
    width: 142,
    height: 87 
  },
})

export default function DjiniLogo (props) {
  return <Image style={[styles.logo, props.style]} source={djini_logo}/>
}
