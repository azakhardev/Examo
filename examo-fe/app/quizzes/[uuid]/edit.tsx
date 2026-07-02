import React, { useState } from "react";
import { Quiz } from "@/types/Quiz";
import { QUIZ_1 } from "@/constants/mocks";
import { useLocalSearchParams } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import QuizEditor from "@/components/quizzes/QuizEditor";
import EditQuizHeader from "@/components/layout/EditQuizHeader";

function EditQuizScreen() {
  const { uuid } = useLocalSearchParams();

  const [quiz, setQuiz] = useState<Quiz>(QUIZ_1); //TODO: Fetch data

  return (
    <ScreenWrapper>
      <EditQuizHeader />

      <QuizEditor quiz={quiz} setQuiz={setQuiz} />
    </ScreenWrapper>
  );
}

export default EditQuizScreen;
