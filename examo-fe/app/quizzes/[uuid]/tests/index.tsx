import { View, Text, StyleSheet } from "react-native";
import COLORS from "@/constants/colors";

function QuizTests() {
  return (
    <View style={styles.container}>
      <Text style={{ color: COLORS.text, fontWeight: "bold" }}>QUIZ TESTS</Text>
    </View>
  );
}

export default QuizTests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
