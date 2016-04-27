/*
 * A thin wrapper over react's AsyncStorage
 *
 */

import {AsyncStorage} from 'react-native'

class Database {

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
