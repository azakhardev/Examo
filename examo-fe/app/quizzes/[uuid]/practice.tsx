import COLORS from "@/constants/colors";
import { StyleSheet, View, Text } from "react-native";

function PracticeScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ color: COLORS.text }}>PRACTICE SCREEN</Text>
    </View>
  );
}

export default PracticeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
});
