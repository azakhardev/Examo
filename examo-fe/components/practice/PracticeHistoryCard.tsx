// components/practice/PracticeHistoryCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "@/constants/colors";
import { PracticeHistory } from "@/types/Practice";
import { formatDateTime, formatDuration } from "@/utils";

type PracticeHistoryCardProps = {
  record: PracticeHistory;
  onContinue?: () => void;
  onReview?: () => void;
};

export default function PracticeHistoryCard({
  record,
  onContinue,
  onReview,
}: PracticeHistoryCardProps) {
  const isOngoing = !record.completed_at;

  return (
    <TouchableOpacity
      style={[styles.card, isOngoing && styles.ongoingCard]}
      activeOpacity={0.7}
      onPress={isOngoing ? onContinue : onReview}
    >
      <View style={styles.headerRow}>
        <Text style={styles.titleText}>
          {formatDateTime(new Date(record.started_at))} -{" "}
          {record.mode.charAt(0) + record.mode.slice(1).toLowerCase()}
        </Text>
        <Text style={styles.durationText}>
          {formatDuration(record.duration_minutes)}
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.statText}>
          Total questions:{" "}
          <Text style={styles.statValue}>{record.total_questions}</Text>
        </Text>

        {isOngoing ? (
          <TouchableOpacity style={styles.continuePill} onPress={onContinue}>
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.statText}>
            Correct:{" "}
            <Text style={styles.statValue}>
              {record.correct_answers}/{record.total_answers}
            </Text>
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  ongoingCard: {
    borderColor: COLORS.primary,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  durationText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "bold",
  },
  statValue: {
    color: COLORS.textSecondary,
    fontWeight: "normal",
  },
  continuePill: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  continueText: {
    color: COLORS.background,
    fontWeight: "bold",
    fontSize: 14,
  },
});
