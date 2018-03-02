import {
  GoogleAnalyticsTracker,
  GoogleAnalyticsSettings
} from 'react-native-google-analytics-bridge'

// The GoogleAnalyticsSettings is static, and settings are applied across all trackers:
// GoogleAnalyticsSettings.setDispatchInterval(30)
// Setting `dryRun` to `true` lets you test tracking without sending data to GA
GoogleAnalyticsSettings.setDryRun(false)

// The tracker must be constructed, and you can have multiple:
const tracker = new GoogleAnalyticsTracker('UA-44469995-5')
tracker.allowIDFA(false)

/**
 * Track the current screen/view
 * @param  {String} screenName The name of the current screen
 */
export function trackScreenView(...args) {
  console.log('track screen view', args)
  tracker.trackScreenView.apply(tracker, args)
}

/**
 * Track an event that has occured
 * @param  {String} category       The event category
 * @param  {String} action         The event action
 * @param  {OptionalValue} optionalValues An object containing optional label and value
 */
export function trackEvent(...args) {
  console.log('track event', args)
  tracker.trackEvent.apply(tracker, args)
}

/**
 * Track an exception
 * @param  {String} error The description of the error
 * @param  {Boolean} fatal A value indiciating if the error was fatal, defaults to false
 */
export function trackException(error, fatal) {
  try {
    let msg = ''
    if (typeof error === 'string') {
      msg = error
    } else {
      msg = error.message
    }
    tracker.trackException(msg, fatal)
  } catch (e) {
    // Ignore
  }
}

/**
 * Sets the current userId for tracking.
 * @param {String} userId The current userId
 */
export function setTrackerUser(userId) {
  console.log('setTrackerUser', userId)
  tracker.setUser(userId)
}
