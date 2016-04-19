# README #

### Requirements ###

1. OS X - This guide assumes OS X which is needed for iOS development.

2. Homebrew is the recommended way to install Watchman and Flow.

3. Install Node.js 4.0 or newer.

4. brew install watchman. We recommend installing watchman, otherwise you might hit a node file watching bug.

### iOS Setup ###
Xcode 7.0 or higher is required. It can be installed from the App Store.

### Android Setup ###
To write React Native apps for Android, you will need to install the Android SDK (and an Android emulator if you want to work on your app without having to use a physical device).

### Quick start ###
Install the React Native command line tools:


```
#!bash
$ npm install -g react-native-cli

```

NOTE: If you see the error, EACCES: permission denied, please run the command: sudo npm install -g react-native-cli.

Create a React Native project:

```
#!bash
$ react-native init AwesomeProject
```

**To run the iOS app:**

* $ cd AwesomeProject
* Open ios/AwesomeProject.xcodeproj and hit run in Xcode.
* Open index.ios.js in your text editor of choice and edit some lines.
* Hit ⌘-R in your iOS simulator to reload the app and see your change!

Note: If you are using an iOS device, see the [Running on iOS Device page](https://github.com/facebook/react-native/blob/master/docs/docs/running-on-device-ios.html#content).

**To run the Android app:**

* $ cd AwesomeProject
* $ react-native run-android
* Open index.android.js in your text editor of choice and edit some lines.
* Press the menu button (F2 by default, or ⌘-M in Genymotion) and select Reload JS to see your change!
* Run adb logcat *:S ReactNative:V ReactNativeJS:V in a terminal to see your app's logs

Note: If you are using an Android device, see the [Running on Android Device page](https://github.com/facebook/react-native/blob/master/docs/docs/running-on-device-android.html#content).