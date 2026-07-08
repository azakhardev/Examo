import COLORS from "@/constants/colors";
import { Test } from "@/types/Test";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type LiveTestHeaderProps = {
  test: Test;
  timeLeft: string;
  hasStarted: boolean;
  onSettingsPress: () => void;
};

function LiveTestHeader({
  test,
  timeLeft,
  hasStarted,
  onSettingsPress,
}: LiveTestHeaderProps) {
  return (
    <View style={styles.headerRow}>
      <Text style={styles.title}>{test.title || test.quiz?.title}</Text>
      {hasStarted ? (
        <Text style={styles.timerText}>{timeLeft}</Text>
      ) : (
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onSettingsPress}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={16} color={COLORS.primary} />
          <Text style={styles.settingsText}>Settings</Text>
        </TouchableOpacity>
      )}
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
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    marginTop: 2,
  },
  settingsText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});
