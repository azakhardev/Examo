import COLORS from "@/constants/colors";
import { Test } from "@/types/Test";
import { View, Text, StyleSheet } from "react-native";

type LiveTestInfoProps = {
  test: Test;
};

function LiveTestInfo({ test }: LiveTestInfoProps) {
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

      <View style={styles.accessCodeContainer}>
        <View style={styles.accessCodePill}>
          <Text style={styles.accessCodeText}>{test.access_code}</Text>
        </View>
        <Text style={styles.accessCodeLabel}>Access code</Text>
      </View>
    </>
  );
}

export default LiveTestInfo;

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
  accessCodeContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  accessCodePill: {
    backgroundColor: COLORS.input,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    marginBottom: 8,
  },
  accessCodeText: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  accessCodeLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "bold",
  },
});
