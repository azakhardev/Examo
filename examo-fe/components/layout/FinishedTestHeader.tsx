import COLORS from "@/constants/colors";
import { Test } from "@/types/Test";
import { View, Text, StyleSheet } from "react-native";

type FinishedTestHeaderProps = {
  test: Test;
};

function TestResultsHeader({ test: testInfo }: FinishedTestHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <Text style={styles.title}>{testInfo.title || testInfo.quiz?.title}</Text>
    </View>
  );
}

export default TestResultsHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
});
