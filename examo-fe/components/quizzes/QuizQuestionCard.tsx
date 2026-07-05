import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import { Question } from "@/types/Question";

type QuizQuestionCardProps = {
  question: Question;
  order: number;
  isEditing: boolean;
  onPress?: () => void;
  onDelete?: () => void;
};

//TODO: Make Cards clickable for displaying correct answers
export default function QuizQuestionCard({
  question,
  isEditing,
  order,
  onPress,
  onDelete,
}: QuizQuestionCardProps) {
  const CardContainer = isEditing ? TouchableOpacity : View;

  return (
    <CardContainer
      style={styles.card}
      activeOpacity={0.7}
      onPress={isEditing ? onPress : undefined}
    >
      <View style={styles.headerRow}>
        <Text style={styles.questionTitle}>
          Question #{order} - {question.type}
        </Text>

        {isEditing && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.questionText}>{question.questionText}</Text>
    </CardContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  questionTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
    marginTop: -4,
    marginRight: -4,
  },
  questionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
