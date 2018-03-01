/*
 * A thin wrapper over react's AsyncStorage
 */

import { AsyncStorage } from 'react-native'

const getJsonItem = key => {
  return AsyncStorage.getItem(key).then(json => {
    if (!json) {
      throw 'no data'
    }
    return JSON.parse(json)
  })
}

class Database {
  saveContacts(contacts) {
    return AsyncStorage.setItem('contacts', JSON.stringify(contacts))
  }

  getContacts() {
    return getJsonItem('contacts')
  }

  saveNotes(notes) {
    return AsyncStorage.setItem('notes', JSON.stringify(notes))
  }

  getNotes() {
    return getJsonItem('notes')
  }
}

export default new Database()
