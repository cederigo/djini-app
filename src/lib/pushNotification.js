/**
 * Utility / Wrapper for push notifications on ios/android
 * 
 * TODO: android
 */

import {List} from 'immutable'
import moment from 'moment'
import {PushNotificationIOS} from 'react-native'

import {listString, quantityString} from './stringUtil'

function groupNote(note) {
  if (note.type === 'task') {
    //dont group them
    return note.id
  } else {
    //group reminders by dueDate
    return note.dueDate
  }
}

export function checkPermissions() {
  return new Promise((resolve) => {
    PushNotificationIOS.checkPermissions(resolve)
  })
}

export function requestPermissions() {
  return PushNotificationIOS.requestPermissions({alert: true})
}

export function updateLocalNotifications(notes) {
  cancelAllLocalNotifications()
  scheduleLocalNotifications(getLocalNotifications(notes))
}

export function scheduleLocalNotifications(notifications) {
  notifications.forEach((n) => {
    console.log('schedule notification', n)
    PushNotificationIOS.scheduleLocalNotification(n)
  })
} 

export function cancelAllLocalNotifications() {
  PushNotificationIOS.cancelAllLocalNotifications()
}

export function getLocalNotifications(notes) {
  if (!notes || !notes.length) {
    return []
  }

  let result = []
  List(notes)
    .filter((note) => note.dueDate && !note.done)
    .groupBy(groupNote)
    .forEach((entries) => {
      entries = entries.toJS()
      // All entries share the same type. See `groupBy` above.
      const note = entries[0]
      const type = note.type
      const dueDate = note.dueDate
      const names = entries.map((e) => e.contact.name)
      // 1 Week before @ 9.00h
      result.push({
        fireDate: moment(dueDate).subtract(7, 'days').hours(9).minute(0).valueOf(),
        alertBody: 
          type === 'reminder' ?
            `${listString(names)} ${quantityString(names.length, 'hat', 'haben')} am ${moment(dueDate).format('Do MMMM')} Geburtstag`
            : `Du hast noch eine Woche um das Geschenk "${note.wish.title}" zu organisieren. `
      })
      // The same day @ 9.00h
      result.push({
        fireDate: moment(dueDate).hours(9).minute(0).valueOf(),
        alertBody: 
          type === 'reminder' ?
            `${listString(names)} ${quantityString(names.length, 'hat', 'haben')} heute Geburtstag`
            : `Hast du das Geschenk "${note.wish.title}" organisiert? Der Anlass findet heute statt.`
      })
    })

  return result
}
