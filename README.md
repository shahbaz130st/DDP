React Native

https://reactnative.dev/docs/environment-setup
- Node v14.17.3 - https://nodejs.org/en/blog/release/v14.15.3
- NPM 6.14.13
- React Native CLI
- JDK-11 - https://www.oracle.com/java/technologies/javase/jdk11-archive-downloads.html
- Android Studio (Chipmunk) ~2021.2.1
- Install emulated device in Tools => device manager if needed

Environment Variables
- JAVA_HOME - path to JDK-11
- ANDROID_HOME - path to android sdk (%LOCALAPPDATA%\Android\Sdk)
- Path - %LOCALAPPDATA%\Android\Sdk\platform-tools

npm install

Run Locally on Android Studio Emulator
npm run android

iOS setup: cocoapods needs install
sudo gem install cocoapods
cd ./DDP/ios
npx react-native setup-ios-permissions && pod install

cd ./DDP
npm run ios


Create Signed Build for Android [https://reactnative.dev/docs/signed-apk-android]
cd ./DDP/android
cd .gradle && mkdir gradle.properties

Build release Signed APK
open Android Studio -> Build -> Generate Signed Bundle / APK
__NOTE: may need to wait for android studio to sync with apps android code__

Add the following to gradle.properties (files in VAULT)
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****

# local api connection
adb devices
adb -s [device_serial_number] reverse tcp:8080 tcp:443
# DDP
