/**
 * # app.js
 *  Bootstrap and navigate according to auth state
 */

import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Parse from 'parse/react-native'
import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import codePush from 'react-native-code-push'

import { version } from '../lib/config'
import { getInitialNotification } from '../lib/pushNotification'

import DjiniLogo from '../components/DjiniLogo'

/* actions */
import { refreshContacts, restoreContacts } from '../actions/contacts'
import { loginSuccess, loginFailure } from '../actions/authActions'
import { updateInstallation } from '../actions/installation'
import { rehydrateNotes } from '../actions/notes'
import { trackEvent, setTrackerUser } from '../lib/analytics'

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    updateInstallation({ version })
    dispatch(restoreContacts())
    dispatch(rehydrateNotes())
    Parse.User.currentAsync()
      .then(parseUser => {
        if (!parseUser) {
          throw new Error('User not logged in')
        }
        setTrackerUser(parseUser.id)
        dispatch(refreshContacts())
        dispatch(loginSuccess(parseUser, false))
        // If app was opened through notification, navigate to notes tab
        getInitialNotification().then(notification => {
          trackEvent('lifecycle', 'opened', { fromNotification: !!notification })
          Actions.home({ initialScene: notification ? 'notesTab' : undefined })
        })
      })
      .catch(error => {
        dispatch(loginFailure(error))
        Actions.welcome()
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <DjiniLogo style={styles.logo} />
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

export default connect()(codePush(App))
