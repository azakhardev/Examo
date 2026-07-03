import { StyleSheet, View, Text } from "react-native";
import COLORS from "@/constants/colors";

type QuizTestsHeaderProps = {
  quizName?: string;
};

function QuizTestsHeader({ quizName }: QuizTestsHeaderProps) {
  return (
    <View style={[styles.header]}>
      <Text style={styles.headerTitle}>{quizName} - Tests</Text>
    </View>
  );
}

export default QuizTestsHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
  },
});
