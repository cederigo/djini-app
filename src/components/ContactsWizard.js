import React, {Component, PropTypes} from 'react'
import {View, StyleSheet} from 'react-native'

import DjiniButton from './DjiniButton'
import DjiniText from './DjiniText'
import {AppBar} from './AppBar'

export default class ContactsWizard extends Component {
  static propTypes = {
    requestPermission: PropTypes.func.isRequired
  }
  render() {
    const {requestPermission} = this.props
    return (
      <View style={styles.container}>
        <AppBar title="Freunde" showBackButton={false}/>
        <DjiniText style={styles.text}>Djini verrät dir, was sich deine Freunde wünschen und hilft dir deine Geschenkideen festzuhalten. Dafür braucht er aber Zugriff auf deine Kontakte! Keine Angst, Djini gibt deine Kontakte nicht weiter!</DjiniText>
        <DjiniButton style={styles.button} onPress={requestPermission} caption="Ja klar, bitte!"/>
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
    marginHorizontal: 25
  },
  button: {
    alignSelf: 'stretch',
    marginHorizontal: 25,
    marginTop: 50
  }
})
