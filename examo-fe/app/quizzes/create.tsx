import React, { useState } from "react";
import { Quiz } from "@/types/Quiz";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import QuizEditor from "@/components/quizzes/QuizEditor";
import CreateQuizHeader from "@/components/layout/CreateQuizHeader";
import useCreateQuiz from "@/api/quizzes/useCreateQuiz";
import Toast from "react-native-toast-message";
import { queryClient } from "@/components/providers/QueryProvider";
import { queryKeys } from "@/api/queryKeys";
import { router } from "expo-router";

function CreateQuizScreen() {
  const [quiz, setQuiz] = useState<Quiz>({
    title: "New Quiz",
    visibility: "PRIVATE",
  });

  const { mutate, isPending } = useCreateQuiz();

  function handleSubmit(quiz: Quiz) {
    mutate(quiz, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Quiz created",
          text2: "We have successfully created your brand new quiz!",
        });
        queryClient.invalidateQueries({ queryKey: queryKeys.quizzes._ });

        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/quizzes");
        }
      },
      onError: (e) => {
        Toast.show({
          type: "error",
          text1: "Creation failed",
          text2: e.message,
        });
      },
    });
  }

  return (
    <ScreenWrapper>
      <CreateQuizHeader />

      <QuizEditor
        quiz={quiz}
        setQuiz={setQuiz}
        onSubmit={handleSubmit}
        isSubmitting={isPending}
      />
    </ScreenWrapper>
  );
}

export default CreateQuizScreen;
