import COLORS from "@/constants/colors";
import { Test } from "@/types/Test";
import { View, Text, StyleSheet } from "react-native";

type LiveTestHeaderProps = {
  test: Test;
  timeLeft: string;
};

function LiveTestHeader({ test: testInfo, timeLeft }: LiveTestHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <Text style={styles.title}>{testInfo.title || testInfo.quiz?.title}</Text>
      <Text style={styles.timerText}>{timeLeft}</Text>
    </View>
  );
}

export default LiveTestHeader;

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
  timerText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"], // Keeps timer from jittering horizontally
  },
});
