# Djini - Wünschen und Schenken
# Techstack
 - react-native - Build Native Mobile Apps using JavaScript and React. https://facebook.github.io/react-native/
 - parse-server - Parse-compatible API server module for Node/Express. https://github.com/ParsePlatform/parse-server
 - code-push - Push code updates to your apps, instantly. http://microsoft.github.io/code-push/
 

# Getting started
How to get up and running for development

- Setup react-native: https://facebook.github.io/react-native/docs/getting-started.html
- Edit `PARSE_SERVER_ID` in src/lib/config.js
- Run simulator: `react-native run-ios` 
- To enable Debugging / Hot Reloading: Shake device / simulator ;-)

# IDE
I recommend Visual studio code with the following plugins:
 - React Native Tools
 - ESLint
 - EditorConfig for VS Code
 
# Tests
Test coverage is bad. More tests are welcome! `src/lib/__tests__/`
```
$ npm run test 
```
or if you want autoreload
```
$ npm run test:watch
```

# Code push - Push code updates to your apps, instantly
Fix Djini bugs instantly. Note: you cant update native code, Only JavaScript and images!

After you release an update the user needs to restart the Djini-App 2 times:
 1. App downloads update if necessary
 2. App installs downloaded update

You can mark an update as "--mandatory" to merge step 1 & 2.

## Setup
- Follow 1 (install) and 2 (register) at http://microsoft.github.io/code-push/
- Ask cre for credentials in step 2

## Release code-push update
 
Note: Make sure your target binary version (ex. -t 1.0.x) matches the one you are targeting out in the field!

Android:
```
$ code-push release-react djini-Android android -t 1.0.x
```

iOS:
```
$ code-push release-react djini-iOS ios -t 1.0.x
```

If you want to update the target binary version on an existing release (ex 1.0.1):
```
$ code-push patch djini-Android Staging -t 1.0.1
$ code-push patch djini-iOS Staging -t 1.0.1
```

# App store release

Edit the version in the following files (I know, its a pane)

 - package.json
 - src/lib/config.js
 - ios/Djini/Info.plist
 - android/app/build.gradle
 
## iOS - XCode

Build IOS release in XCode

 - On the top choose "Generic iOS Device"
 - Build archive (Product -> Archive)
 - Export../Upload to App Store.. your archive in the Organizer window (Window > Organizer)
 
## Android
 - Ask cre for the "signing key"
 - Build Android release
```
$ cd android && ./gradlew assembleRelease
```
 - Upload the final .apk file (android/app/build/outputs/apk/app-release.apk)

# Parse-server
See repository: https://bitbucket.org/soomit/wma-001-parse-server
