/* global setTimeout: false */

/**
 * Utility / Wrapper for push notifications on ios/android
 */

import {List} from 'immutable'
import moment from 'moment'
import {PushNotificationIOS, Platform} from 'react-native'
import PushNotification from 'react-native-push-notification'

import {listString, quantityString} from './stringUtil'
import {parseDate} from './dateUtil'

export function configurePushNotification() {
  PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: function() { 
      /* nothing to do here, but required. see:
       * https://github.com/facebook/react-native/issues/9105
       */ 
    },
    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: { alert: true , badge: false, sound: false },
    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: false,
    /**
      * (optional) default: true
      * - Specified if permissions (ios) and token (android and ios) will requested or not,
      * - if not, you must call PushNotificationsHandler.requestPermissions() later
      */
    requestPermissions: false,
  });
}

export function getInitialNotification() {
  return new Promise((resolve) => {
    PushNotification.popInitialNotification(resolve)
  })
}

export function checkPermissions() {
  return new Promise((resolve) => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.checkPermissions(resolve)
    } else {
      resolve({alert: true})
    }
  })
}

export function requestPermissions() {
  return PushNotification.requestPermissions()
}

export function updateLocalNotifications(notes) {
  cancelAllLocalNotifications()
  // Give some time before rescheduling
  // Doesnt work on real hw otherwise
  setTimeout(function() {
    scheduleLocalNotifications(getLocalNotifications(notes))
  }, 1000);
}

export function scheduleLocalNotifications(notifications) {
  notifications.forEach((n) => {
    console.log('schedule notification', n)
    if (Platform.OS === 'android') {
      PushNotification.localNotificationSchedule({ 
        date: new Date(n.fireDate),
        message: n.alertBody,
        smallIcon: "ic_notification"
      })
    } else {
      PushNotificationIOS.scheduleLocalNotification(n)
    }
  })
} 

export function cancelAllLocalNotifications() {
  PushNotification.cancelAllLocalNotifications()
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
        fireDate: parseDate(dueDate).subtract(7, 'days').hours(9).minute(0).valueOf(),
        alertBody: 
          type === 'reminder' ?
            `${listString(names)} ${quantityString(names.length, 'hat', 'haben')} am ${moment(dueDate).format('Do MMMM')} Geburtstag`
            : `Nicht vergessen, du musst noch "${note.wish.title}" für ${note.contact.name} besorgen`
      })
      // The same day @ 9.00h
      result.push({
        fireDate: parseDate(dueDate).hours(9).minute(0).valueOf(),
        alertBody: 
          type === 'reminder' ?
            `${listString(names)} ${quantityString(names.length, 'hat', 'haben')} heute Geburtstag`
            : `Nicht vergessen, du musst noch "${note.wish.title}" für ${note.contact.name} besorgen`
      })
    })

  return result
}

/**
 * Helper
 */
function groupNote(note) {
  if (note.type === 'task') {
    //dont group them
    return note.id
  } else {
    //group reminders by dueDate
    return note.dueDate
  }
}
