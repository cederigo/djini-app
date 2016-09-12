/**
 * # app.js
 *  navigate according to auth state
 */

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import Parse from 'parse/react-native'
import React, {Component} from 'react'
import { View, StyleSheet } from 'react-native';

import {version} from '../lib/config'

import DjiniLogo from '../components/DjiniLogo'

/* actions */
import {refreshContacts} from '../actions/contacts';
import {loginSuccess, loginFailure} from '../actions/authActions';
import {updateInstallation} from '../actions/installation'

class App extends Component {

  componentDidMount() {
    const {dispatch} = this.props
    Parse.User.currentAsync()
      .then((parseUser) => {
        if (!parseUser) {
          throw new Error('User not logged in')
        }
        dispatch(loginSuccess(parseUser))
        dispatch(refreshContacts())
      })
      .catch((error) => {
        dispatch(loginFailure(error))
        Actions.welcome()
      })

    updateInstallation({version})
  }

  render() {
    return (
      <View style={styles.container}>
        <DjiniLogo style={styles.logo}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  logo: {
    marginTop: 80
  }
})

export default connect()(App);
