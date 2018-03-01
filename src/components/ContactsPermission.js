import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

import { AppBar } from './AppBar'
import DjiniText from './DjiniText'
import DjiniButton from './DjiniButton'

export default class ContactsPermission extends Component {
  render() {
    const { refreshContacts } = this.props
    return (
      <View style={styles.container}>
        <AppBar title="Freunde" showBackButton={false} />
        <DjiniText style={styles.text}>
          Du hast den Zugriff auf deine Kontakte verweigert. Weil Djini ziemlich nett ist, kannst du
          es dir jederzeit anders überlegen und die Freigabe über die App-Einstellungen auf deinem
          Mobilgerät manuell erteilen.
        </DjiniText>
        <DjiniButton style={styles.button} onPress={refreshContacts} caption="Neu laden" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    marginTop: 36,
    marginHorizontal: 25
  },
  button: {
    marginHorizontal: 25,
    marginTop: 50
  }
})
