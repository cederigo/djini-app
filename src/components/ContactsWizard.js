import { connect } from 'react-redux';
import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import {refreshContacts} from '../actions/contacts'

import WMColors from '../lib/WMColors'
import WMButton from './WMButton'

class ContactsWizard extends Component {
  props: {
    isFetching: bool
  }

  render() {
    const {dispatch, isFetching} = this.props
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Erklärung warum wir Zugriff auf dein Adressbuch wollen</Text>
        <WMButton disabled={isFetching} style={styles.button} onPress={() => dispatch(refreshContacts('user'))} caption="Auf Kontakte zugreifen" />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  text: {
    color: WMColors.lightText,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 30
  }
})

function select(state) {
  return {
    isFetching: state.contacts.isFetching
  }
}
export default connect(select)(ContactsWizard)
