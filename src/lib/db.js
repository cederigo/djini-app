/*
 * A thin wrapper over react's AsyncStorage
 *
 */

import {AsyncStorage} from 'react-native'

class Database {

  saveContacts(contacts) {
    return AsyncStorage.setItem('contacts', JSON.stringify(contacts))
  }

  getContacts() {
    return AsyncStorage.getItem('contacts')
      .then(json => {
        if (!json) {
          throw('no data')
        }
        return JSON.parse(json)
      })
  }
}

export default new Database()
