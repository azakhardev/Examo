import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Quiz } from "@/types/Quiz";
import COLORS from "@/constants/colors";

type QuizCardProps = {
  quizz: Quiz;
  onPress?: () => void;
};

export default function QuizCard({ quizz, onPress }: QuizCardProps) {
  const uuid_array = quizz.id.split("-");
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.title} numberOfLines={1}>
          {quizz.title}
        </Text>
        {quizz.favorite && (
          <Ionicons name="star" size={20} color={COLORS.primary} />
        )}
      </View>

      <Text style={styles.authorText}>
        <Text style={styles.authorLabel}>Author: </Text>
        {quizz.author}
      </Text>

      <Text style={styles.description} numberOfLines={3}>
        {quizz.description}
      </Text>

      <Text style={styles.uuid} numberOfLines={1}>
        {uuid_array[0]}-{uuid_array.reverse()[0]}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  title: {
    flex: 1,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  authorText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 12,
  },
  authorLabel: {
    color: COLORS.text,
    fontWeight: "bold",
  },
  description: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  uuid: {
    color: COLORS.textSecondary,
    fontSize: 10,
    textAlign: "right",
  },
});
