import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import COLORS from "@/constants/colors";
import { Test } from "@/types/Test";

export type Quiz = {
  id: string;
  title: string;
  author: string;
};

type TestCardProps = {
  test: Test;
  maxPoints?: number;
  onPress?: () => void;
};

export default function TestCard({ test, maxPoints, onPress }: TestCardProps) {
  const isHistory =
    test.total_gained_points !== undefined || test.submitted_at !== undefined;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      {!isHistory && (
        <View style={styles.lengthBadge}>
          <Text style={styles.smallText}>
            <Text style={styles.boldLabel}>Length: </Text>
            {test.time_limit_minutes}m
          </Text>
        </View>
      )}

      <Text style={styles.title} numberOfLines={2}>
        {test.quiz?.title}
      </Text>

      {/* Autor */}
      <Text style={styles.authorText}>
        <Text style={styles.boldLabel}>Author: </Text>
        {test.quiz?.author}
      </Text>

      <View style={styles.bottomRow}>
        <Text style={styles.smallText}>
          <Text style={styles.boldLabel}>Start: </Text>
          {test.start_at}
        </Text>

        {isHistory ? (
          <Text style={styles.smallText}>
            <Text style={styles.boldLabel}>Points: </Text>
            {test.total_gained_points}/{maxPoints ?? "?"}
          </Text>
        ) : (
          <Text style={styles.smallText}>
            <Text style={styles.boldLabel}>End: </Text>
            {test.end_at}
          </Text>
        )}
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
    marginBottom: 16,
    position: "relative",
  },
  lengthBadge: {
    position: "absolute",
    top: 10,
    right: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    paddingRight: 80,
    marginBottom: 4,
  },
  authorText: {
    color: COLORS.textSecondary,
    fontSize: 12,
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
