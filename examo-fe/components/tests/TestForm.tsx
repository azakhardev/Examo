import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { useForm } from "react-hook-form";
import COLORS from "@/constants/colors";
import { formatTime } from "@/utils";
import QuestionCard from "./QuestionCard";
import { TestSession } from "@/types/Test";
import { SubmittedAnswer } from "@/api/tests/useSubmitTest";

export type TestAnswers = Record<string, string | string[]>;

type TestFormProps = {
  session: TestSession;
  onSubmit: (answers: SubmittedAnswer[]) => void;
  isSubmitting?: boolean;
};

export default function TestForm({
  session,
  onSubmit,
  isSubmitting,
}: TestFormProps) {
  const { control, handleSubmit } = useForm<TestAnswers>({
    defaultValues: {},
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    if (!session.expiresAt) return 0;
    const expiresMs = new Date(session.expiresAt).getTime();
    const nowMs = Date.now();
    const diffSeconds = Math.floor((expiresMs - nowMs) / 1000);
    return diffSeconds > 0 ? diffSeconds : 0;
  });

  const handleFinish = useCallback(
    (formData: TestAnswers) => {
      Alert.alert(
        "Submit Test",
        "Are you sure you want to submit your answers? You cannot change them later.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Submit",
            onPress: () => {
              // Transform the flat form data into the structured backend payload
              const formattedAnswers: SubmittedAnswer[] = Object.entries(
                formData,
              ).map(([questionId, rawAnswer]) => {
                // Find the original question to know its type
                const question = session.questions?.find(
                  (q) => q.id === questionId,
                );

                // 1. Handle OPEN questions (Text)
                if (question?.type === "OPEN") {
                  return {
                    questionId,
                    answer: { text: (rawAnswer as string) ?? "" },
                  };
                }

                // 2. Handle MULTIPLE_CHOICE (Array of IDs)
                if (Array.isArray(rawAnswer)) {
                  // If user selected "skip", send empty array
                  const isSkipped = rawAnswer.includes("skip");
                  return {
                    questionId,
                    answer: {
                      optionIds: isSkipped ? [] : rawAnswer,
                      skipped: isSkipped,
                    },
                  };
                }

                // 3. Handle SINGLE_CHOICE and TRUE_FALSE (Single ID)
                return {
                  questionId,
                  answer: { optionIds: rawAnswer ? [rawAnswer as string] : [] },
                };
              });

              // Send the structured data up to the parent screen
              onSubmit(formattedAnswers);
            },
          },
        ],
      );
    },
    [onSubmit, session.questions],
  );

  useEffect(() => {
    // Auto-submit when time is up
    if (timeLeft <= 0) {
      handleSubmit(handleFinish)();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [handleSubmit, timeLeft, handleFinish]);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.title} numberOfLines={1}>
        {session.title}
      </Text>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit(handleFinish)}
        activeOpacity={0.8}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>SUBMIT</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={session.questions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        renderItem={({ item, index }) => (
          <QuestionCard question={item} index={index} control={control} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
    marginRight: 16,
  },
  timerText: {
    color: COLORS.text,
    fontSize: 18,
    fontVariant: ["tabular-nums"],
  },
  listContent: {
    paddingBottom: 40,
  },
  footer: {
    marginTop: 8,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 24,
    width: "80%",
    alignItems: "center",
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "bold",
  },
});
