import COLORS from "@/constants/colors";
import { Test } from "@/types/Test";
import { View, Text, StyleSheet } from "react-native";

type LiveTestInfoProps = {
  test: Test;
};

function TestInfo({ test }: LiveTestInfoProps) {
  return (
    <>
      <Text style={styles.description}>{test.description}</Text>

      <View style={styles.dateRow}>
        <Text style={styles.dateText}>
          <Text style={styles.boldText}>Start: </Text>
          {test.start_at}
        </Text>
        <Text style={styles.dateText}>
          <Text style={styles.boldText}>End: </Text>
          {test.end_at.replace("T", " ").substring(0, 16)}
        </Text>
      </View>
    </>
  );
}

export default TestInfo;

const styles = StyleSheet.create({
  description: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dateText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  boldText: {
    color: COLORS.text,
    fontWeight: "bold",
  },
});
