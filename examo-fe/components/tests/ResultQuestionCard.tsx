// components/tests/ResultQuestionCard.tsx
import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { Controller, Control } from "react-hook-form";
import COLORS from "@/constants/colors";
import {
  TestSubmissionAnswer,
  GradeSubmissionForm,
} from "@/types/TestSubmission";
import { formatEnum } from "@/utils";

type ResultQuestionCardProps = {
  submissionAnswer: TestSubmissionAnswer;
  index: number;
  control?: Control<GradeSubmissionForm>;
};

export default function ResultQuestionCard({
  submissionAnswer,
  index,
  control,
}: ResultQuestionCardProps) {
  const { question, answer, gained_points, id } = submissionAnswer;

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          Question #{index + 1} - {formatEnum(question.type)}
        </Text>

        {control ? (
          <View style={styles.pointsEditContainer}>
            <Text style={styles.pointsLabel}>Points: </Text>
            <Controller
              control={control}
              name={`points.${id}`}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={styles.pointsInput}
                  value={value?.toString()}
                  onChangeText={(val) => onChange(Number(val) || 0)}
                  keyboardType="numeric"
                  selectTextOnFocus
                />
              )}
            />
            <Text style={styles.pointsMax}>/{question.maxPoints}</Text>
          </View>
        ) : (
          <Text style={styles.pointsText}>
            Points: <Text style={{ color: COLORS.text }}>{gained_points}</Text>/
            {question.maxPoints}
          </Text>
        )}
      </View>

      {/* --- Question Text --- */}
      <Text style={styles.questionText}>{question.questionText}</Text>

      {/* --- Original Options (If Applicable) --- */}
      {question.options && question.options.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Options:</Text>
          {question.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i); // Generates A, B, C, D...
            return (
              <Text key={opt.id} style={styles.optionText}>
                {letter}) {opt.text}
              </Text>
            );
          })}
        </View>
      )}

      {/* --- Student's Submitted Answers --- */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Answers:</Text>
        {answer.map((ans, i) => {
          // If correct is null (e.g. Open text pending review), default to standard text color
          let color = COLORS.textSecondary;
          if (ans.correct === true) color = COLORS.success;
          if (ans.correct === false) color = COLORS.danger;

          // Try to match the answer text to an option to get the A, B, C letter (Optional Polish)
          const matchedIndex = question.options?.findIndex(
            (o) => o.text === ans.text,
          );
          const prefix =
            matchedIndex !== undefined && matchedIndex >= 0
              ? `${String.fromCharCode(65 + matchedIndex)}) `
              : "";

          return (
            <Text key={i} style={[styles.answerText, { color }]}>
              {prefix}
              {ans.text}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.input,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
    paddingRight: 8,
  },
  pointsText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "bold",
  },
  pointsEditContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pointsLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "bold",
  },
  pointsInput: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 4,
    color: COLORS.text,
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 40,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
  },
  pointsMax: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 4,
  },
  questionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  section: {
    marginTop: 8,
    gap: 6,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  optionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
