/**
 * # app.js
 *  Display startup screen and navigate according to auth state
 */

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import Parse from 'parse/react-native'
import React, {Component} from 'react'
import { 
  StyleSheet,
  View,
  Text,
} from 'react-native';

import {version} from '../lib/config'
import WMColors from '../lib/WMColors'

/* actions */
import {loginSuccess, loginFailure} from '../actions/authActions';
import {refreshContacts} from '../actions/contacts';
import {updateInstallation} from '../actions/installation'

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: WMColors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
  summary: {
    fontSize: 32,
    fontWeight: 'bold',
    color: WMColors.lightText
  }
});

class App extends Component {

  componentDidMount() {
    const {dispatch} = this.props
    Parse.User.currentAsync()
      .then((parseUser) => {
        if (!parseUser) {
          throw new Error('User not logged in')
        }
        dispatch(refreshContacts())
        dispatch(loginSuccess(parseUser))
      })
      .catch((error) => {
        dispatch(loginFailure(error))
        Actions.welcome()
      })

    updateInstallation({version})
  }

  render() {
    return(
      <View style={ styles.container }>
        <Text style={ styles.summary }>Djini</Text>
      </View>
    );
  }
}

export default connect()(App);
