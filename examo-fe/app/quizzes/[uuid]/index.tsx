import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import COLORS from "@/constants/colors";

import QuizDetailHeader from "@/components/layout/QuizDetailHeader";
import QuizSettingsModal from "@/components/quizzes/QuizSettingsModal";
import QuizQuestionCard from "@/components/quizzes/QuizQuestionCard";
import { QUIZ_1 } from "@/constants/mocks";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

function QuizDetailScreen() {
  const { uuid }: { uuid: string } = useLocalSearchParams();

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const quiz = QUIZ_1;

  function handlePractice() {
    router.push({
      pathname: "/quizzes/[uuid]/practice",
      params: { uuid: uuid },
    });
  }

  function handleStartTest() {
    router.push({
      pathname: "/quizzes/[uuid]/tests",
      params: { uuid: uuid },
    });
  }

  function handleToggleFavorite() {
    setIsFavorite((old) => !old);
    console.log("Toggle favorite - send request", isFavorite);
  }

  return (
    <ScreenWrapper>
      <QuizDetailHeader
        title="React Hooks Mastery"
        isFavorite={isFavorite}
        isEditing={false}
        onFavoriteToggle={handleToggleFavorite}
        onSettingsPress={() => setIsSettingsVisible(true)}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{quiz.description}</Text>
        </View>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.practiceButton]}
            onPress={handlePractice}
            activeOpacity={0.8}
          >
            <Text style={styles.practiceButtonText}>Practice</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.testButton]}
            onPress={handleStartTest}
            activeOpacity={0.8}
          >
            <Text style={styles.testButtonText}>Tests</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.questionsHeaderRow}>
          <Text style={styles.questionsHeaderTitle}>
            Questions ({quiz.questions?.length})
          </Text>
        </View>

        <View style={styles.questionsList}>
          {quiz.questions?.map((q, i) => (
            <QuizQuestionCard
              key={q.id}
              question={q}
              isEditing={false}
              order={i + 1}
            />
          ))}
        </View>
      </ScrollView>

      <QuizSettingsModal
        uuid={uuid}
        visible={isSettingsVisible}
        onClose={() => setIsSettingsVisible(false)}
        onDelete={() => console.log("Delete triggered")}
      />
    </ScreenWrapper>
  );
}

export default QuizDetailScreen;

const styles = StyleSheet.create({
  descriptionContainer: {
    marginBottom: 24,
  },
  descriptionText: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 22,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  practiceButton: {
    backgroundColor: COLORS.primary,
  },
  practiceButtonText: {
    color: COLORS.background,
    fontWeight: "bold",
    fontSize: 16,
  },
  testButton: {
    backgroundColor: COLORS.secondary,
  },
  testButtonText: {
    color: COLORS.text,
    fontWeight: "bold",
    fontSize: 16,
  },
  questionsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  questionsHeaderTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  questionsList: {
    flex: 1,
  },
});
