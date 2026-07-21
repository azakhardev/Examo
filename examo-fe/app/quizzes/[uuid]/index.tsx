import React, { useEffect, useState } from "react";
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
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import useGetQuizDetail from "@/api/quizzes/useGetQuizDetail";
import Loader from "@/components/ui/Loader";
import useToggleFavorite from "@/api/quizzes/useToggleFavorite";
import Toast from "react-native-toast-message";
import { queryClient } from "@/components/providers/QueryProvider";
import { queryKeys } from "@/api/queryKeys";

function QuizDetailScreen() {
  const { uuid }: { uuid: string } = useLocalSearchParams();

  const [isSettingsVisible, setIsSettingsVisible] = useState(false);

  const { data, isLoading, isError, error } = useGetQuizDetail(uuid);

  const [isFavorite, setIsFavorite] = useState(data?.favorite ?? false);

  const { mutateAsync } = useToggleFavorite(uuid);

  useEffect(() => {
    setIsFavorite(data?.favorite ?? false);
  }, [data, setIsFavorite]);

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

  async function handleToggleFavorite() {
    setIsFavorite((old) => !old);

    await mutateAsync(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.quizzes._ });
      },
      onError: () => {
        setIsFavorite((old) => !old);
        Toast.show({
          type: "error",
          text1: "Failed to save",
          text2: "Failed to add this quiz to your favorites.",
        });
      },
    });
  }

  return (
    <ScreenWrapper>
      <QuizDetailHeader
        title={data?.title ? data.title : "Loading..."}
        isFavorite={isFavorite}
        isEditing={false}
        onFavoriteToggle={handleToggleFavorite}
        onSettingsPress={() => setIsSettingsVisible(true)}
      />
      {isLoading ? (
        <Loader />
      ) : (
        !isError && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.descriptionContainer}>
              <Text style={styles.descriptionText}>{data?.description}</Text>
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
                Questions ({data?.questions?.length})
              </Text>
            </View>

            <View style={styles.questionsList}>
              {data?.questions?.map((q, i) => (
                <QuizQuestionCard
                  key={q.id}
                  question={q}
                  isEditing={false}
                  order={i + 1}
                />
              ))}
            </View>
          </ScrollView>
        )
      )}

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
