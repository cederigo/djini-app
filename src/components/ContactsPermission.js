import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import {AppBar} from './AppBar'
import DjiniText from './DjiniText'

export default class ContactsPermission extends Component {
  render() {
    return (
      <View style={styles.container}>
        <AppBar title="Freunde" showBackButton={false}/>
        <DjiniText style={styles.text}>Weil Djini ziemlich nett ist, kannst du es dir jederzeit anders überlegen und die Freigabe in den App-Einstellungen in deinen Smartphone-Einstellungen erteilen</DjiniText>
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
  },
})
