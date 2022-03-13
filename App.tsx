import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Asset } from "expo-asset";
import { getCurrentFrameWithDecimalZeroes, getFrameGaps } from "./src/utils";
import { RNFFmpeg, RNFFmpegConfig } from "react-native-ffmpeg";
import VideoFramesSrcubber from "./src/components/VideoFramesScrubber";

export default function App() {
  const [inputVideoPath, setInputVideoPath] = useState("");
  const [framesPath, setFramesPath] = useState("");
  const [totalFrames, setTotalFrames] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);

  const imageFilePrefix = "video-frame-img-";
  const imageFileExtension = "jpeg";
  const totalDecimalZeroes = 7;

  const backgroundFramesMultiplier = Math.ceil(totalFrames / 7) + 1;
  const backgroundPreviewFrames = totalFrames
    ? getFrameGaps(backgroundFramesMultiplier, backgroundFramesMultiplier * 7)
    : [];

  useEffect(() => {
    const proceed = async () => {
      const inputVideo = await Asset.loadAsync(
        require("./src/video/input-video.mp4")
      );
      const inputVideoPath = inputVideo[0].localUri;

      setInputVideoPath(inputVideoPath ?? "");
    };
    proceed();
  }, []);

  useEffect(() => {
    if (inputVideoPath) {
      const inputVideoPathArr = inputVideoPath?.split("/");
      inputVideoPathArr?.pop();
      const outputFramesPath = inputVideoPathArr?.join("/");

      if (!framesPath) {
        RNFFmpeg?.executeAsync(
          `-y -i ${inputVideoPath} -r 30 ${outputFramesPath}/${imageFilePrefix}%0${totalDecimalZeroes}d.${imageFileExtension}`,
          (execution) => {
            if (execution.returnCode === 0) {
              console.log("SUCCESS", execution.executionId);
              RNFFmpegConfig.getLastCommandOutput().then((output) => {
                setFramesPath(outputFramesPath ?? "");
                setTotalFrames((output.match(/frame=/gi)?.length ?? 0) - 1);
                setCurrentFrame(1);
              });
            } else {
              console.log("ERROR:", execution.returnCode);
            }
          }
        );
      }
    }
  }, [inputVideoPath]);

  return (
    <View style={styles.rootContainer}>
      <StatusBar style="auto" />
      {inputVideoPath && framesPath ? (
        <>
          <View>
            <Image
              source={{
                uri: `${framesPath}/${imageFilePrefix}${getCurrentFrameWithDecimalZeroes(
                  currentFrame,
                  totalDecimalZeroes
                )}.${imageFileExtension}`,
              }}
              style={{ height: 400, width: 250, backgroundColor: "#000" }}
            />
          </View>

          <VideoFramesSrcubber
            currentFrame={currentFrame}
            onFrameChanged={(updatedFrame: number) =>
              setCurrentFrame(updatedFrame)
            }
            backgroundPreviewFrames={backgroundPreviewFrames}
            framesPath={framesPath}
            totalDecimalZeroes={totalDecimalZeroes}
            imageFileExtension={imageFileExtension}
            imageFilePrefix={imageFilePrefix}
          />
        </>
      ) : (
        <>
          <ActivityIndicator color={"blue"} size={"large"} />
          <Text style={{ marginTop: 10 }}>Processing Video ...</Text>
          <Text style={{ marginTop: 10 }}>
            Generating Scrubber to select your cover frame ...
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
