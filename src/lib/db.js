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

  saveFriends(friends) {
    return AsyncStorage.setItem('friends', JSON.stringify(friends))
  }

  getFriends() {
    return AsyncStorage.getItem('friends')
      .then(json => JSON.parse(json))
  }

  deleteFriends() {
    return AsyncStorage.removeItem('friends');
  }
}

export default new Database()
