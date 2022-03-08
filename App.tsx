import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Asset } from "expo-asset";
import { RNFFmpeg } from "react-native-ffmpeg";

export default function App() {
  useEffect(() => {
    const proceed = async () => {
      const content = await Asset.loadAsync(require("./src/input-video.mp4"));
      const videoUri = content[0].localUri;

      RNFFmpeg.execute("-i " + videoUri + " -r 1/1 filename%03d.jpeg").then(
        (result) => {
          console.log(`===>  FFmpeg 1 process exited with rc=${result}.`);
        }
      );
    };
    proceed();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Video Frame Picker (React Native)</Text>
      <StatusBar style="auto" />
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
