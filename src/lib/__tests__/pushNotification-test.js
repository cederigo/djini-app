/* global describe, it, expect, jest */
/* @flow */

jest.mock('react-native-router-flux', () => 'Actions');

import {note} from '../../reducers/note/noteInitialState'
import moment from 'moment'
import 'moment/locale/de'

/* Set default locale */
moment.locale('de')

/**
 * Under test
 */
import {getLocalNotifications} from '../pushNotification'


/**
 * Helper
 */
function getReminderNote(props = {}, contactName) {
  return {...note, ...props, contact: {name: contactName}}
}

describe('./lib/pushNotification', () => {
  describe('getLocalNotifications()', () => {

    it('should handle edge cases', () => {
      let result = getLocalNotifications()
      expect(result.length).toBe(0)
    })

    it('computes reminder notifications correctly', () =>{
      const d1 = new Date()
      const d2 = new Date(Date.now() + 1000)
      const d3 = new Date(Date.now() + 2000)
      const notes = [
        getReminderNote({dueDate: d1}, 'Alfonso'),
        getReminderNote({dueDate: d1}, 'Thierry'),
        getReminderNote({dueDate: d2}, 'Hannes'),
        getReminderNote({dueDate: d2}, 'Fritz'),
        getReminderNote({dueDate: d2}, 'Peter'),
        getReminderNote({dueDate: d3}, 'Corinne'),
      ]
      let result = getLocalNotifications(notes)
      expect(result.length).toBe(3 * 2 /* notifications per note */)
      expect(result[0].alertBody).toBe(`Alfonso und Thierry haben am ${moment(d1).format('Do MMMM')} Geburtstag`)
      expect(result[0].fireDate).toBe(moment(d1).subtract(7, 'days').hour(9).minute(0).valueOf())
      expect(result[1].alertBody).toBe(`Alfonso und Thierry haben heute Geburtstag`)
      expect(result[1].fireDate).toBe(moment(d1).hour(9).minute(0).valueOf())
      expect(result[3].alertBody).toBe(`Hannes, Fritz und Peter haben heute Geburtstag`)
      expect(result[5].alertBody).toBe(`Corinne hat heute Geburtstag`)
    })
  })
});
