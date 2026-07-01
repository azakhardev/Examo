import { View, Text, StyleSheet } from "react-native";
import COLORS from "@/constants/colors";

function QuizTestsScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ color: COLORS.text, fontWeight: "bold" }}>QUIZ TESTS</Text>
    </View>
  );
}

export default QuizTestsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
