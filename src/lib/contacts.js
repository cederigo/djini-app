/*
 * A thin wrapper over https://github.com/rt2zz/react-native-contacts
 */

import {Platform, PermissionsAndroid} from 'react-native'
import contacts from 'react-native-contacts'
import {transliterate} from './transliteration'
import {formatNumber} from './phoneUtil' 

class Contacts {

  _formatContact(raw) {
    const firstName = raw.givenName ? raw.givenName : ''
    const lastName = raw.familyName ? raw.familyName : ''
    return {
      name: firstName + ' ' + lastName,
      phoneNumber: formatNumber(raw.phoneNumbers[0].number)
    }
  }

  _isValidContact(raw) {
    return raw.phoneNumbers && raw.phoneNumbers.length
      && (raw.givenName || raw.familyName)
  }

  transliterate(contacts) {
    Object.values(contacts).forEach((contact) => {
      contact.nameTransliterated = transliterate(contact.name.toLowerCase())
    })
    return contacts
  }

  requestPermission() {
    if (Platform.OS === 'android') {
      return PermissionsAndroid.requestPermission(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
        .then((granted) => {
          return granted ? 'authorized' : 'denied'
        })
    }
    return new Promise((resolve, reject) => {
      contacts.requestPermission((err, permission) => {
        if (err) {
          return reject(err)
        }
        resolve(permission)
      })
    })
  }

  checkPermission() {
    return new Promise((resolve, reject) => {
      contacts.checkPermission((err, permission) => {
        if (err) {
          return reject(err)
        }
        resolve(permission)
      })
    })
  }

  getAll() {
    return new Promise((resolve, reject) => {
      contacts.getAll((err, records) => {
        if (err) {
          return reject(new Error(err.type))
        }

        let result = {} //contacts dictionary with phoneNumber as key

        records.forEach((c) => {
          if (!this._isValidContact(c)) {
            return; //nothing to do
          }

          let formattedContact = this._formatContact(c)
          result[formattedContact.phoneNumber] = formattedContact
        })

        resolve(result)
      })
    })
  }
}

export default new Contacts()
