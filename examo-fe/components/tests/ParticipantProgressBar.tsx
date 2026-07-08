import COLORS from "@/constants/colors";
import { ParticipantProgress } from "@/types/ParticipantProgress";
import { View, Text, StyleSheet } from "react-native";

function ParticipantProgressBar({
  progress,
}: {
  progress: ParticipantProgress;
}) {
  const percentage = Math.min(
    (progress.answers / progress.totalQuestions) * 100,
    100,
  );
  const isFinished = progress.answers === progress.totalQuestions;

  const barColor = isFinished ? COLORS.success : COLORS.primary;

  return (
    <View style={styles.participantRow}>
      <Text style={styles.usernameText} numberOfLines={1}>
        {progress.user.username}
      </Text>
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${percentage}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    </View>
  );
}

export default ParticipantProgressBar;

const styles = StyleSheet.create({
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.input,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  usernameText: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
    marginRight: 16,
  },
  progressBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: COLORS.input,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 5,
  },
});
