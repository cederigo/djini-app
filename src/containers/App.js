/**
 * # app.js
 *  Bootstrap and navigate according to auth state
 */

import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux'
import Parse from 'parse/react-native'
import React, {Component} from 'react'
import { View, StyleSheet, PushNotificationIOS} from 'react-native';
import codePush from "react-native-code-push";

import {version} from '../lib/config'

import DjiniLogo from '../components/DjiniLogo'

/* actions */
import {refreshContacts, restoreContacts} from '../actions/contacts';
import {loginSuccess, loginFailure} from '../actions/authActions';
import {updateInstallation} from '../actions/installation'
import {rehydrateNotes} from '../actions/notes'

class App extends Component {

  componentDidMount() {
    // HACK: see https://github.com/facebook/react-native/issues/9105
    // You absolutely need this for requestPermissions() promise to resolve.
    PushNotificationIOS.addEventListener('register', () => {});
    
    const {dispatch} = this.props
    updateInstallation({version})
    dispatch(restoreContacts())
    dispatch(rehydrateNotes())
    Parse.User.currentAsync()
      .then((parseUser) => {
        if (!parseUser) {
          throw new Error('User not logged in')
        }
        dispatch(loginSuccess(parseUser))
        dispatch(refreshContacts())
        // If app was opened through notification, navigate to notes tab
        PushNotificationIOS.getInitialNotification()
          .then((notification) => {
            if (notification) {
              Actions.notesTab()
            }
          })
      })
      .catch((error) => {
        dispatch(loginFailure(error))
        Actions.welcome()
      })
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

export default connect()(codePush(App));
