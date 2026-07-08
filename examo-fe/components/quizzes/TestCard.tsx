import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "@/constants/colors";
import { Test } from "@/types/Test";
import { formatDateTime } from "@/utils";

type TestCardProps = {
  test: Test;
  onPress?: () => void;
  mode: "live" | "results";
};

export default function TestCard({ test, onPress, mode }: TestCardProps) {
  // Use description as title if available, fallback to quiz title
  const displayTitle = test.description || test.quiz?.title || "My test";

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      {/* Participants Badge (Absolute Top Right) */}
      <View style={styles.badge}>
        <Text style={styles.smallText}>
          {mode === "results" ? (
            <>
              <Text style={styles.boldLabel}> Submissions: </Text>{" "}
              {test.total_submissions}/{test.total_participants}{" "}
            </>
          ) : (
            <>
              <Text style={styles.boldLabel}>Participants: </Text>
              {test.total_participants || 0}
            </>
          )}
        </Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {displayTitle}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.smallText}>
          <Text style={styles.boldLabel}>Start: </Text>
          {formatDateTime(new Date(test.start_at!))}
        </Text>

        <Text style={styles.smallText}>
          <Text style={styles.boldLabel}>End: </Text>
          {formatDateTime(new Date(test.end_at!))}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: COLORS.surface,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
    paddingRight: 100,
    marginBottom: 16,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallText: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },
  boldLabel: {
    color: COLORS.text,
    fontWeight: "bold",
  },
});
