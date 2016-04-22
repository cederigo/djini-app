/*
 * A thin wrapper over react's AsyncStorage
 *
 */

import {AsyncStorage} from 'react-native'

class Database {

  saveSessionToken(sessionToken) {
    return AsyncStorage.setItem('session-token', sessionToken)
  }

  getSessionToken() {
    return AsyncStorage.getItem('session-token');
  }

  deleteSessionToken() {
    return AsyncStorage.removeItem('session-token');
  }

  saveCurrentUser(user) {
    return AsyncStorage.setItem('current-user', JSON.stringify(user))
  }

  getCurrentUser() {
    return AsyncStorage.getItem('current-user')
      .then(json => JSON.parse(json))
  }

  deleteCurrentUser() {
    return AsyncStorage.removeItem('current-user');
  }

  saveSocialState(state) {
    return AsyncStorage.setItem('social-state', JSON.stringify(state))
  }

  getSocialState() {
    return AsyncStorage.getItem('social-state')
      .then(json => {
        if (!json) {
          throw('no data')
        }
        return JSON.parse(json)
      })
  }
}

export default new Database()
