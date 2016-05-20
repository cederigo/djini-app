import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import WMColors from '../lib/WMColors'

export default class ContactsPermission extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Kein Zugriff auf dein Adressbuch</Text>
        <Text style={styles.text}>Gehe zu Settings > Wishmaster</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: WMColors.background
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    color: WMColors.lightText
  },
})
