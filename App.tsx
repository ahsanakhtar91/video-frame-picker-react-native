import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  PanResponder,
  ActivityIndicator,
} from "react-native";
import { Asset } from "expo-asset";
import { RNFFmpeg, RNFFmpegConfig } from "react-native-ffmpeg";

export default function App() {
  const [inputVideoPath, setInputVideoPath] = useState("");
  const [framesPath, setFramesPath] = useState("");
  const [totalFrames, setTotalFrames] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(1);

  const imageFilePrefix = "video-frame-";
  const imageFileExtentsion = "jpeg";
  const totalDecimalZeroes = 7;

  useEffect(() => {
    const proceed = async () => {
      const inputVideo = await Asset.loadAsync(
        require("./src/input-video.mp4")
      );
      const inputVideoPath = inputVideo[0].localUri;

      setInputVideoPath(inputVideoPath ?? "");
    };
    proceed();
  }, []);

  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          pan.setOffset({
            x: pan.x._value,
            y: pan.y._value,
          });
        },
        onPanResponderMove: (e, gestureState) => {
          const updatedFrame = parseInt((e.nativeEvent.pageX / 10).toString());
          Animated.event(
            [
              null,
              {
                dx: pan.x,
                dy: pan.y,
              },
            ],
            { useNativeDriver: false }
          )(e, gestureState);
        },
        onPanResponderRelease: (e, gestureState) => {
          pan.flattenOffset();
          const updatedFrame = parseInt((e.nativeEvent.pageX / 10).toString());
          console.log(updatedFrame);
          setCurrentFrame(updatedFrame);
        },
      }),
    [currentFrame]
  );

  useEffect(() => {
    if (inputVideoPath) {
      const inputVideoPathArr = inputVideoPath?.split("/");
      inputVideoPathArr?.pop();
      const outputFramesPath = inputVideoPathArr?.join("/");

      if (!framesPath) {
        RNFFmpeg?.executeAsync(
          `-i ${inputVideoPath} -r 30 ${outputFramesPath}/${imageFilePrefix}%0${totalDecimalZeroes}d.${imageFileExtentsion}`,
          (execution) => {
            if (execution.returnCode === 0) {
              console.log("SUCCESS", execution.executionId);
              RNFFmpegConfig.getLastCommandOutput().then((output) => {
                setFramesPath(outputFramesPath ?? "");
                setTotalFrames((output.match(/frame=/gi)?.length ?? 0) - 1);
                setCurrentFrame(1);
                console.log("outputFramesPath:", outputFramesPath);
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
  }, [inputVideoPath]);

  const getCurrentFrameWithDecimalZeroes = (frameNumber: number) => {
    return ("0".repeat(totalDecimalZeroes) + frameNumber).slice(
      -totalDecimalZeroes
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {inputVideoPath && framesPath ? (
        <>
          <View style={{}}>
            <Image
              source={{
                uri: `${framesPath}/${imageFilePrefix}${getCurrentFrameWithDecimalZeroes(
                  currentFrame
                )}.${imageFileExtentsion}`,
              }}
              style={{ height: 400, width: 250, backgroundColor: "#000" }}
            />
          </View>

          <View style={styles.container2} key={new Date().getTime()}>
            {[1, 2, 3, 4, 5, 6, 9].map((frameNumber, i) => (
              <ImageBackground
                key={i}
                source={{
                  uri: `${framesPath}/${imageFilePrefix}${getCurrentFrameWithDecimalZeroes(
                    frameNumber
                  )}.${imageFileExtentsion}`,
                }}
                style={{
                  backgroundColor: "#000",
                  width: 50,
                  height: 80,
                  opacity: 0.7,
                }}
                width={50}
                height={80}
              />
            ))}
            <View>
              <Animated.View
                style={{
                  transform: [{ translateX: pan.x }],
                }}
                {...panResponder.panHandlers}
              >
                <Image
                  source={{
                    uri: `${framesPath}/${imageFilePrefix}${getCurrentFrameWithDecimalZeroes(
                      currentFrame
                    )}.${imageFileExtentsion}`,
                  }}
                  style={{
                    backgroundColor: "#000",
                    width: 50,
                    height: 80,
                    borderColor: "#ddd",
                    borderRadius: 10,
                    borderWidth: 3,
                    position: "absolute",
                  }}
                  width={50}
                  height={80}
                />
              </Animated.View>
            </View>
          </View>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    // flex: 1,
    marginTop: 60,
    backgroundColor: "#000",
    width: "90%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
