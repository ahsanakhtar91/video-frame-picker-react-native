------------------------------
Video Frame Picker (React Native)

------------------------------

**Live Demo** video is attached below!

This is an example **React Native** application in which a **picker/scrubber component** is created that allows to select a frame from a video by scrubbing/swiping through all of the image frames of the video, which is similar to the cover frame picker screen in **Instagram** which appears while uploading a video and asks you to select an image from the video to be treated as the cover/thumbnail of the video. 

So, the **Video Frame Picker** is built as a clone of that screen. The technologies used to build this app are **React Native**, **TypeScript**, **Expo**, **XCode**, **React Hooks**, etc. This app is specifically tested on **iOS** and the most highlighted library used to build it is **[react-native-ffmpeg](https://www.npmjs.com/package/react-native-ffmpeg)**. The features of this app are:  

- All of the frames from a sample **mp4** video start getting extracted upon launching the app to be later used in the **VideoFramesSrcubber** component.
- A **loader** screen is shown only, until all the frames are extracted and the app is ready to proceed further to the main screen.
- Upon successful extraction, the main screen appears containing a **scrubber component** at the bottom (a **swipeable bar** that navigates through all of the frames).
- The main screen also has a **preview** component that shows the **selected frame** at the top, it keeps showing the preview of the frame selected through scrubbing/swiping.
- The preview is also shown in a small frame inside the scrubber/swipeable bar component at the bottom too.
- So, by horizontally swiping/scrubbing the small frame present in the scrubber component (using left-to-right and right-to-left finger gestures on scrubber component), the frames/images from the video are previewed along the way. In the end, the frame/image in the preview area is going to be the selected frame.
- A Live Demo video is attached below to show how this app works.

<code>**Live Demo**: https://www.loom.com/share/aa0eb589ae654ec8abefb22ababd5c6a</code>

Steps to run the Video Frame Picker (React Native) App:
- Get your React Native development environment ready, following the docs [here](https://reactnative.dev/docs/environment-setup) (skip if already done).
- Run command <code>yarn install</code> on the root directory of Video Frame Picker (React Native) App to install the node packages.
- This example app is specifically tested on iOS, so make sure your iOS setup for React Native is ready (including XCode, CocoaPods, Simulator, etc.). 
- After that, open up the Terminal (**macOS**).
- Run <code>cd ios</code> on the root directory of the project folder.
- Run <code>pod install</code>
- Run <code>open videoframepickerreactnative.xcworkspace</code>
- **XCode** will open. 
- Build the application in XCode (using **Build** option in **Product** menu).
- Return back to Terminal.
- Run <code>cd ..</code> (to move back to root directory).
- Run the App by running the command <code>expo start --dev-client -c</code> on the root directory.
- If all goes well, you will see the app running in your iOS Simulator.
