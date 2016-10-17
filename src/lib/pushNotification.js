/* global setTimeout: false */

/**
 * Utility / Wrapper for push notifications on ios/android
 */

import {PushNotificationIOS, Platform} from 'react-native'
import PushNotification from 'react-native-push-notification'
import {getNotesNotifications} from './pushNotificationFactory'

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
  scheduleLocalNotifications(getNotesNotifications(notes))
  // Give some time before rescheduling
  // Doesnt work on real hw otherwise
  // setTimeout(function() { }, 2000);
}

export function scheduleLocalNotifications(notifications) {
  const now = Date.now()
  notifications.forEach((n) => {
    // Dont schedule past push notifications 
    if (n.fireDate < now) { return; }
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
