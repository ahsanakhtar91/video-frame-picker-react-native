import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { Asset } from "expo-asset";
import { RNFFmpeg, RNFFmpegConfig } from "react-native-ffmpeg";
import Video from "react-native-video";

export default function App() {
  const [inputVideoPath, setVideo] = useState("");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [framesPath, setFramesPath] = useState("");
  const [totalFrames, setTotalFrames] = useState(0);
  const [currentFrame, setCurrentFrames] = useState(1);

  const videoRef = useRef<Video>(null);

  const imageFilePrefix = "vid-frame-";
  const imageFileExtentsion = "jpeg";

  useEffect(() => {
    const proceed = async () => {
      const inputVideo = await Asset.loadAsync(
        require("./src/input-video.mp4")
      );
      const inputVideoPath = inputVideo[0].localUri;

      setVideo(inputVideoPath ?? "");
    };
    proceed();
  }, []);

  console.log(framesPath, totalFrames);

  useEffect(() => {
    if (videoLoaded) {
      // videoRef?.current?.seek(0.0);

      const inputVideoPathArr = inputVideoPath?.split("/");
      inputVideoPathArr?.pop();
      const outputFramesPath = inputVideoPathArr?.join("/");

      if (!framesPath) {
        RNFFmpeg?.executeAsync(
          `-i ${inputVideoPath} -r 30 ${outputFramesPath}/${imageFilePrefix}%07d.${imageFileExtentsion}`,
          (execution) => {
            if (execution.returnCode === 0) {
              console.log("SUCCESS", execution.executionId);
              RNFFmpegConfig.getLastCommandOutput().then((output) => {
                setFramesPath(outputFramesPath ?? "");
                setTotalFrames((output.match(/frame=/gi)?.length ?? 0) - 1);
                setCurrentFrames(1);
                console.log(
                  `TOTAL FRAMES: ${(output.match(/frame=/gi)?.length ?? 0) - 1}`
                );
              });
            } else {
              console.log("ERROR:", execution.returnCode);
            }
          }
        );
      }
    }
  }, [videoLoaded]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {inputVideoPath ? (
        <>
          <View style={{}}>
            <Video
              source={{ uri: inputVideoPath }}
              paused={true}
              ref={videoRef}
              onSeek={(seek) => {
                console.log("onSeek", seek);
              }}
              onReadyForDisplay={() => setVideoLoaded(true)}
              style={{ height: 400, width: 900 }}
            />
          </View>

          {videoLoaded && framesPath ? (
            <View style={{ marginTop: 100 }}>
              <Image
                source={{
                  uri: `${framesPath}/${imageFilePrefix}000000${1}.${imageFileExtentsion}`,
                }}
                style={{
                  backgroundColor: "#000",
                  width: 50,
                  height: 80,
                }}
                width={50}
                height={80}
              />
            </View>
          ) : (
            <></>
          )}
        </>
      ) : (
        <Text>Loading ...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
