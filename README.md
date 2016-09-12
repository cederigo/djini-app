# README #

## Making a release ##

Edit the version in the following files (I know, its a pane)
 - package.json
 - src/lib/config.js
 - ios/Djini/Info.plist
 - android/app/build.gradle

Build IOS release in XCode
 - edit ios/Wishmaster/AppDelegate.m (comment OPTION 1, uncomment OPTION 2)
 - On the top choose "Generic iOS Device"
 - Build archive (Product -> Archive)
 - Export../Upload to App Store.. your archive in the Organizer window (Window > Organizer)

Build Android release
```
$ cd android && ./gradlew assembleRelease
```
