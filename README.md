#  ddnWalletMobile

## how to run it

```
yarn
```

ios
```
react-native run-ios
```

android
```
react-native run-android
```

## how to build android

### warinng: we need .keystore file, Place the .keystore file under the android/app directory in your project folder.
```
cd android && ./gradlew assembleRelease
```

## fix bugs in Linux

- Could not list contents of '~/ddn-wallet-mobile/node_modules/sodium-native/tmp/lib/libsodium.so'. Couldn't follow symbolic link.

```
unlink ~/ddn-wallet-mobile/node_modules/sodium-native/tmp/lib/libsodium.so
```
- Could not list contents of '~/ddn-wallet-mobile/node_modules/sodium-native/tmp/lib/libsodium.so.23'. Couldn't follow symbolic link.

```
unlink ~/ddn-wallet-mobile/node_modules/sodium-native/tmp/lib/libsodium.so.23
```

## fix bus in MacOS

- config.h not found
```
cd node_modules/react-native/third-party/glog-0.3.4 && ../../scripts/ios-configure-glog.sh && cd ../../../../
```


## Currently includes:

* React Native
* React Navigation
* MobX State Tree
* TypeScript
* And more!

## Quick Start

The ddnWalletMobile project's structure will look similar to this:

```
ddnWalletMobile-project
├── src
│   ├── app
│   ├── i18n
│   ├── lib
│   ├── models
│   ├── navigation
│   ├── services
│   ├── theme
│   ├── views
├── storybook
│   ├── views
│   ├── index.ts
│   ├── storybook-registry.ts
│   ├── storybook.ts
├── test
│   ├── __snapshots__
│   ├── storyshots.test.ts.snap
│   ├── mock-i18n.ts
│   ├── mock-reactotron.ts
│   ├── setup.ts
│   ├── storyshots.test.ts
├── README.md
├── android
│   ├── app
│   ├── build.gradle
│   ├── gradle
│   ├── gradle.properties
│   ├── gradlew
│   ├── gradlew.bat
│   ├── keystores
│   └── settings.gradle
├── index.js
├── ios
│   ├── ddnWalletMobileProject
│   ├── ddnWalletMobileProject-tvOS
│   ├── ddnWalletMobileProject-tvOSTests
│   ├── ddnWalletMobileProject.xcodeproj
│   └── ddnWalletMobileProjectTests
└── package.json
```

## ./src directory

The inside of the src directory looks similar to the following:

```
src
├── app
│── i18n
├── lib
├── models
├── navigation
├── services
├── theme
├── views
```

**app**
This is where a lot of your app's initialization takes place. Here you'll find:
* root-component.tsx - This is the root component of your app that will render your navigators and other views.

**i18n**
This is where your translations will live if you are using `react-native-i18n`.

**lib**
This is a great place to put miscellaneous helpers and utilities. Things like date helpers, formatters, etc. are often found here. However, it should only be used for things that are truely shared across your application. If a helper or utility is only used by a specific component or model, consider co-locating your helper with that component or model.

**models**
This is where your app's models will live. Each model has a directory which will contain the `mobx-state-tree` model file, test file, and any other supporting files like actions, types, etc.

**navigation**
This is where your `react-navigation` navigators will live.

**services**
Any services that interface with the outside world will live here (think REST APIs, Push Notifications, etc.).

**theme**
Here lives the theme for your application, including spacing, colors, and typography.

**views**
This is where all of your components will live. Both dumb components and screen components will be located here. Each component will have a directory containing the `.tsx` file, along with a story file, and optionally `.presets`, and `.props` files for larger components.

You may choose to futher break down this directory by organizing your components into "domains", which represent cohesive areas of your application. For example, a "user" domain could hold all components and screens related to managing a user.

**storybook**
This is where your stories will be registered and where the Storybook configs will live

**test**
This directory will hold your Jest configs and mocks, as well as your [storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) test file. This is a file that contains the snapshots of all your component storybooks.

## Running Storybook
From the command line in your generated app's root directory, enter `yarn run storybook`
This starts up the storybook server.

In `src/app/main.tsx`, change `SHOW_STORYBOOK` to `true` and reload the app.

For Visual Studio Code users, there is a handy extension that makes it easy to load Storybook use cases into a running emulator via tapping on items in the editor sidebar. Install the `React Native Storybook` extension by `Orta`, hit `cmd + shift + P` and select "Reconnect Storybook to VSCode". Expand the STORYBOOK section in the sidebar to see all use cases for components that have `.story.tsx` files in their directories.