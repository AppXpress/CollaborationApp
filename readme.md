# Customer Collaboration App

Customer Collaboration is an app written in React-Native that allows different GT Nexus customers to collaborate on ideas and feedback for the GT Nexus platform.

  - Create threads and discuss back and forth
  - Support for voting on threads
  - View attachments
  - Respond directly to others comments

## Platforms 

  - iOS 7 and above
  - Android Jelly Bean (API level 16) and above


## Setup
These instructions will get a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project for release.

  1. Set up React-Native environment according to their [documentation](https://facebook.github.io/react-native/docs/getting-started.html)
  2. Clone this repository:
    `git clone  https://github.com/AppXpress/CollaborationApp.git`
  3. Install dependecies using `npm install` or `yarn`
  4. Create the file `src/Environments.js` with the following contents:
```  
export default [
    {
        name: 'Demo',
        url: 'https://demo.gtnexus.com/rest/310',
        key: 'YOUR DATA KEY HERE',
        dictionary: {
            '&thread': '$CCThreadT1',
            '&comment': '$CCCommentT1'
        }
    }, ... repeat for additional environments
];    

```

  5. Run the project with:
`react-native start` followed by `react-native run-android` or `react-native run-ios`

## Deployment
  * Android: Created a [signed APK](https://facebook.github.io/react-native/docs/signed-apk-android.html)
  * iOS: Configure release scheme in [xCode](https://facebook.github.io/react-native/docs/running-on-device.html#3-build-app-for-release)

## Dependencies
   * [React Native Fetch Blob](https://github.com/wkh237/react-native-fetch-blob) - For downloading image attachments from GTN
   * [React Native Navigation](https://github.com/wix/react-native-navigation) - For smooth stack navigation an both Android and iOS