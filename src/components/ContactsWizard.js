import { connect } from 'react-redux';
import React, {Component} from 'react';
import {View, Text, StyleSheet, StatusBar} from 'react-native';

import {refreshContacts} from '../actions/contacts'

import WMColors from '../lib/WMColors'
import DjiniButton from './DjiniButton'
import {AppBar} from './AppBar'

class ContactsWizard extends Component {
  props: {
    isFetching: bool
  }

  render() {
    const {dispatch, isFetching} = this.props
    return (
      <View style={styles.container}>
        <StatusBar translucent={true} />
        <AppBar title="Freunde" showBackButton={false}/>
        <Text style={styles.text}>Djini verrät dir, was sich deine Freunde wünschen und hilft dir deine Geschenkideen festzuhalten. Dafür braucht er aber Zugriff auf deine Kontakte! Keine Angst, Djini gibt deine Kontakte nicht weiter!</Text>
        <DjiniButton disabled={isFetching} style={styles.button} onPress={() => dispatch(refreshContacts('user'))} caption="Ja klar, bitte!" />
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
  button: {
    alignSelf: 'stretch',
    marginHorizontal: 25,
    marginTop: 50
  }
})

function select(state) {
  return {
    isFetching: state.contacts.isFetching
  }
}
export default connect(select)(ContactsWizard)
