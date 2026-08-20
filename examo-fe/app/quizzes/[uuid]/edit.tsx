import React, { useState, useEffect } from "react";
import { Quiz } from "@/types/Quiz";
import { useLocalSearchParams } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import QuizEditor from "@/components/quizzes/QuizEditor";
import EditQuizHeader from "@/components/layout/EditQuizHeader";
import useEditQuiz from "@/api/quizzes/useEditQuiz";
import Toast from "react-native-toast-message";
import { queryClient } from "@/components/providers/QueryProvider";
import { queryKeys } from "@/api/queryKeys";
import useGetQuizDetail from "@/api/quizzes/useGetQuizDetail";
import Loader from "@/components/ui/Loader";
import { Text } from "react-native";
import ErrorView from "@/components/ui/ErrorView";

function EditQuizScreen() {
  const { uuid } = useLocalSearchParams();
  const quizUuid = uuid as string;

  const {
    data: serverQuiz,
    isLoading,
    isError,
    error,
  } = useGetQuizDetail(quizUuid);

  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const { mutate, isPending } = useEditQuiz(quizUuid);

  useEffect(() => {
    if (serverQuiz && !quiz) {
      setQuiz(serverQuiz);
    }
  }, [serverQuiz, quiz]);

  function handleSubmit(updatedQuiz: Quiz) {
    mutate(updatedQuiz, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Quiz edited",
          text2: "We have successfully updated your quiz information",
        });
        queryClient.invalidateQueries({ queryKey: queryKeys.quizzes._ });
      },
      onError: (e) => {
        Toast.show({
          type: "error",
          text1: "Failed to edit",
          text2: e.message,
        });
      },
    });
  }

  if (isLoading || !quiz) {
    return (
      <ScreenWrapper>
        <EditQuizHeader />
        <Loader />
      </ScreenWrapper>
    );
  }

  if (isError) {
    return <ErrorView error={error} />;
  }

  return (
    <ScreenWrapper>
      <EditQuizHeader />
      <QuizEditor
        quiz={quiz}
        setQuiz={setQuiz as React.Dispatch<React.SetStateAction<Quiz>>}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    </ScreenWrapper>
  );
}

export default EditQuizScreen;
