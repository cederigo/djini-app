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
}

export default new Database()
