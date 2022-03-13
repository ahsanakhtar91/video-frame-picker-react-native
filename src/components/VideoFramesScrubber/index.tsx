import { useMemo, useRef } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  View,
  PanResponder,
} from "react-native";
import { getCurrentFrameWithDecimalZeroes } from "../../utils";

type VideoFramesSrcubberProps = {
  currentFrame: number;
  onFrameChanged: (updatedFrame: number) => void;
  backgroundPreviewFrames: Array<number>;
  framesPath: string;
  totalDecimalZeroes: number;
  imageFileExtension: string;
  imageFilePrefix: string;
};

export default function VideoFramesSrcubber({
  currentFrame,
  onFrameChanged,
  backgroundPreviewFrames,
  framesPath,
  totalDecimalZeroes,
  imageFileExtension,
  imageFilePrefix,
}: VideoFramesSrcubberProps) {
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
          console.log(parseInt((e.nativeEvent.pageX / 10).toString()));
          const updatedFrame = parseInt((e.nativeEvent.pageX / 10).toString());
          onFrameChanged(updatedFrame);
        },
      }),
    [currentFrame]
  );

  return (
    <View style={styles.scrubberContainer}>
      {backgroundPreviewFrames.map((frameNumber, i) => (
        <ImageBackground
          key={i}
          source={{
            uri: `${framesPath}/${imageFilePrefix}${getCurrentFrameWithDecimalZeroes(
              frameNumber,
              totalDecimalZeroes
            )}.${imageFileExtension}`,
          }}
          style={styles.backgroundFrame}
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
                currentFrame,
                totalDecimalZeroes
              )}.${imageFileExtension}`,
            }}
            style={styles.selectedFrame}
            width={50}
            height={80}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrubberContainer: {
    marginTop: 60,
    backgroundColor: "#000",
    width: "90%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  backgroundFrame: {
    backgroundColor: "#000",
    width: 50,
    height: 80,
    opacity: 0.55,
  },
  selectedFrame: {
    backgroundColor: "#000",
    width: 50,
    height: 80,
    borderColor: "#dee",
    borderRadius: 10,
    borderWidth: 3,
    position: "absolute",
  },
});
