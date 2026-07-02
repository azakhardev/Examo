import React, { useState } from "react";
import { Quiz } from "@/types/Quiz";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import QuizEditor from "@/components/quizzes/QuizEditor";
import CreateQuizHeader from "@/components/layout/CreateQuizHeader";

function CreateQuizScreen() {
  const [quiz, setQuiz] = useState<Quiz>({
    title: "New Quiz",
    visibility: "PRIVATE",
  });

  return (
    <ScreenWrapper>
      <CreateQuizHeader />

      <QuizEditor quiz={quiz} setQuiz={setQuiz} />
    </ScreenWrapper>
  );
}

export default CreateQuizScreen;
