# README #

## Code push ##
A cloud service that enables React Native developers to deploy mobile app updates directly to their users’ devices.
https://github.com/Microsoft/code-push

Note: Make sure your target binary version (Info.plist, build.gradle)
matches the one you are targeting out in the field!

Ex. to update the target binary version:
$ code-push patch djini-Android Staging -t 0.9.5

Android:
$ code-push release-react djini-Android android

iOS:
$ code-push release-react djini-iOS ios

## Making a release ##

Edit the version in the following files (I know, its a pane)

 - package.json
 - src/lib/config.js
 - ios/Djini/Info.plist
 - android/app/build.gradle

Build IOS release in XCode

 - On the top choose "Generic iOS Device"
 - Build archive (Product -> Archive)
 - Export../Upload to App Store.. your archive in the Organizer window (Window > Organizer)

Build Android release
```
$ cd android && ./gradlew assembleRelease
```
