------------------------------
Video Frame Picker (React Native)

------------------------------

<code>**Live Demo**: </code>

This is an example **React Native** application in which a **picker/scrubber component** is created that allows to select a frame from a video by scrubbing through all of the image frames of the video, which is similar to the cover frame picker screen in **Instagram** which appears while uploading a video and asks you to select an image from the video to be treated as the cover/thumbnail of the video. 

So, the Video Frame Picker is built as a replica of that screen. The technologies used to build this app are **React Native**, **TypeScript**, **Expo**, **XCode**, **React Hooks**. This app is specifically tested on **iOS** and the most highlighted library used to build it is **[react-native-ffmpeg](https://www.npmjs.com/package/react-native-ffmpeg)**. The features of this app are:  
- All of the frames in the **mp4** video start getting extracted upon launching the app to be later used in the **VideoFramesSrcubber** component.
- A **loader** component is shown only, until all the frames are extracted and the app is ready to proceed further to the main screen.
- Upon successful extraction, main screen appears containing a **scrubber component** at the bottom (a bar that navigates through all the frames).
- The main screen also has a **selected frame preview** component at the top, it keeps showing the preview of the frame selected through scrubbing, the preview is also shown in a small frame inside the scrubber component too.
- So, by horizontally swiping the small frame present in the scrubber component (using left-to-left or left-to-right finger gestures), the selected frame/image from the video is previewed while scrubbing through.
- A Live Demo video is attached to show how this app works.

<code>**Live Demo**: </code>

Steps to run the Video Frame Picker (React Native) App:
- Get your React Native development environment ready, following the docs here: https://reactnative.dev/docs/environment-setup (skip if already done).
- Run command <code>yarn install</code> on the root directory of Video Frame Picker (React Native) App to install the node packages.
- This example app is specifically tested on iOS, so make sure your iOS setup for React Native (including Xcode, Simulator, CocoaPods etc.) is ready. After that:
- Run <code>cd ios</code>
- Run <code>pod install</code>
- Run <code>open videoframepickerreactnative.xcworkspace</code>
- Run <code>cd ..</code> (to move back to root directory)
- Run the App by running the command <code>expo start --dev-client -c</code> on the root directory.
- If all goes well, you will see the app running in your iOS Simulator.
