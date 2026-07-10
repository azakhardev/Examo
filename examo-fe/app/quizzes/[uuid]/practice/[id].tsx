// screens/PracticeActiveScreen.tsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  FlatList,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { Quiz } from "@/types/Quiz";
import { PracticeSetup } from "@/types/Practice";
import { Question, QuestionOption } from "@/types/Question";
import PracticeTimer from "@/components/practice/PracticeTimer";
import QuestionContent from "@/components/practice/QuestionContent";
import { QUIZ_1 } from "@/constants/mocks";
import PracticeNavigation from "@/components/practice/PracticeNavigation";

// --- MOCK DATA (Replace with local storage / params) ---
const MOCK_SETUP: PracticeSetup = {
  mode: "RACE",
  showCorrectAnswers: true,
  questionTimeLimit: 15, // seconds
  questionsType: "ALL",
  questionsRangeStart: 0,
  questionsRangeEnd: 10,
  shuffle: false,
};

export default function PracticeActiveScreen() {
  const { id } = useLocalSearchParams();

  // --- Core State ---
  const [setup] = useState<PracticeSetup>(MOCK_SETUP);
  const [questions] = useState<Question[]>(QUIZ_1.questions || []);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Local answers: { questionId: string | string[] }
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  // Track which questions have been explicitly "submitted" to show feedback
  const [submittedStates, setSubmittedStates] = useState<
    Record<string, boolean>
  >({});

  const currentQuestion = questions[currentIndex];
  const isCurrentSubmitted = submittedStates[currentQuestion?.id];

  // --- Interaction Handlers ---
  function handleSelectOption(optionId: string) {
    if (isCurrentSubmitted) return; // Lock if already submitted

    const qId = currentQuestion.id;
    setAnswers((prev) => {
      if (currentQuestion.type === "MULTIPLE_CHOICE") {
        const current = (prev[qId] as string[]) || [];
        if (current.includes(optionId)) {
          return { ...prev, [qId]: current.filter((id) => id !== optionId) };
        }
        return { ...prev, [qId]: [...current, optionId] };
      }
      // Single Choice / True False
      return { ...prev, [qId]: optionId };
    });

    // TODO: Save updated answers to LocalStorage/AsyncStorage here
  }

  function handleSubmitAnswer() {
    setSubmittedStates((prev) => ({ ...prev, [currentQuestion.id]: true }));
    // TODO: Update LocalStorage session progress
  }

  function handleNext() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinishPractice();
    }
  }

  function handleFinishPractice() {
    Alert.alert(
      "Practice Complete",
      "You have reached the end of this practice session.",
      [
        {
          text: "Finish",
          onPress: () => {
            // TODO: Sync practice_history summary to backend, clear local session, route back
            router.back();
          },
        },
      ],
    );
  }

  if (!currentQuestion) return null;

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentIndex + 1} / {questions.length}
        </Text>
        <TouchableOpacity onPress={handleFinishPractice}>
          <Text style={styles.finishText}>Finish</Text>
        </TouchableOpacity>
      </View>

      {setup.questionTimeLimit > 0 && (
        <PracticeTimer
          timeLimit={setup.questionTimeLimit}
          onSubmit={handleSubmitAnswer}
          questionIndex={currentIndex}
          isSubmitted={isCurrentSubmitted}
        />
      )}

      <QuestionContent
        question={currentQuestion}
        onSelect={handleSelectOption}
        showCorrect={setup.showCorrectAnswers}
        isSubmitted={isCurrentSubmitted}
        answers={answers}
      />

      {/* Action Button */}
      <View style={styles.actionContainer}>
        {!isCurrentSubmitted && setup.showCorrectAnswers ? (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSubmitAnswer}
          >
            <Text style={styles.primaryButtonText}>SUBMIT ANSWER</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
            <Text style={styles.primaryButtonText}>
              {currentIndex < questions.length - 1 ? "NEXT QUESTION" : "FINISH"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Bottom Navigation (Jump between questions) */}
      <PracticeNavigation
        onPress={(id: number) => setCurrentIndex(id)}
        questions={questions}
        answers={answers}
        currentIndex={currentIndex}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  finishText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "bold",
  },

  actionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
  },
  primaryButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
