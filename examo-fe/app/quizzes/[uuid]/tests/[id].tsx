import { View, Text, StyleSheet } from "react-native";
import COLORS from "@/constants/colors";

function QuizTestDetail() {
  return (
    <View style={styles.container}>
      <Text style={{ color: COLORS.text, fontWeight: "bold" }}>
        QUIZ TEST DETAIL
      </Text>
    </View>
  );
}

export default QuizTestDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
