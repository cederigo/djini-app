import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';

import WMColors from '../lib/WMColors'
import {AppBar} from './AppBar'

export default class ContactsPermission extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        <AppBar title="Freunde" showBackButton={false}/>
        <Text style={styles.text}>Weil Djini ziemlich nett ist, kannst du es dir jederzeit anders überlegen und die Freigabe in den App-Einstellungen in deinen Smartphone-Einstellungen erteilen</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    marginTop: 36,
    marginHorizontal: 25,
    color: WMColors.lightText,
    fontSize: 17
  },
})
