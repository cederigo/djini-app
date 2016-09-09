import { connect } from 'react-redux';
import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import {refreshContacts} from '../actions/contacts'

import DjiniButton from './DjiniButton'
import DjiniText from './DjiniText'
import {AppBar} from './AppBar'

class ContactsWizard extends Component {
  props: {
    isFetching: bool
  }

  render() {
    const {dispatch, isFetching} = this.props
    return (
      <View style={styles.container}>
        <AppBar title="Freunde" showBackButton={false}/>
        <DjiniText style={styles.text}>Djini verrät dir, was sich deine Freunde wünschen und hilft dir deine Geschenkideen festzuhalten. Dafür braucht er aber Zugriff auf deine Kontakte! Keine Angst, Djini gibt deine Kontakte nicht weiter!</DjiniText>
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
