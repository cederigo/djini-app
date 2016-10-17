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
import {getNotesNotifications} from '../pushNotificationFactory'


/**
 * Helper
 */
function getReminderNote(props = {}, contactName) {
  return {...note, ...props, contact: {name: contactName}}
}

function getTaskNote(props = {}, contactName) {
  return {...note, ...props, type: 'task', contact: {name: contactName}}
}

describe('./lib/pushNotificationFactory', () => {
  describe('getNotesNotifications()', () => {

    it('should handle edge cases', () => {
      let result = getNotesNotifications()
      expect(result.length).toBe(0)
    })

    it('computes notifications correctly (reminder notes)', () =>{
      const d1 = new Date()
      const notes = [
        getReminderNote({dueDate: d1}, 'Alfonso'),
        getReminderNote({dueDate: d1}, 'Thierry'),
      ]
      let result = getNotesNotifications(notes)
      expect(result.length).toBe(3)
      expect(result[0].alertBody).toBe(`Denk daran, dass Alfonso und Thierry in 14 Tagen Geburtstag haben`)
      expect(result[0].fireDate).toBe(moment(d1).subtract(14, 'days').hour(9).minute(0).valueOf())
      expect(result[1].alertBody).toBe(`Alfonso und Thierry haben am ${moment(d1).format('Do MMMM')} Geburtstag. Weißt du schon, was du schenken wirst?`)
      expect(result[1].fireDate).toBe(moment(d1).subtract(7, 'days').hour(9).minute(0).valueOf())
      expect(result[2].alertBody).toBe(`Alfonso und Thierry haben heute Geburtstag. Gratulieren nicht vergessen!`)
      expect(result[2].fireDate).toBe(moment(d1).hour(9).minute(0).valueOf())
    })
    
    it('computes notifications correctly (task notes)', () =>{
      const d1 = new Date()
      const notes = [
        getTaskNote({dueDate: d1}, 'Hannes'),
      ]
      let result = getNotesNotifications(notes)
      expect(result.length).toBe(2)
      expect(result[0].alertBody).toBe(`Denk daran, du musst noch das Geschenk für Hannes besorgen`)
      expect(result[0].fireDate).toBe(moment(d1).subtract(10, 'days').hour(9).minute(0).valueOf())
      expect(result[1].alertBody).toBe(`Du hast noch 4 Tage um das Geschenk für Hannes zu besorgen`)
      expect(result[1].fireDate).toBe(moment(d1).subtract(4, 'days').hour(9).minute(0).valueOf())
    })
  })
});
