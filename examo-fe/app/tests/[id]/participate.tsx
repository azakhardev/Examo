import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import JoinTest from "@/components/tests/JoinTest";
import TestForm, { SubmittedAnswer } from "@/components/tests/TestForm";
import { QUIZ_1 } from "@/constants/mocks";
import { Alert } from "react-native";

export default function ParticipateTestScreen() {
  const { id } = useLocalSearchParams();

  const [isParticipant, setIsParticipant] = useState<boolean>(false); //TODO: Request to backend

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      if (isParticipant) {
        e.preventDefault();

        Alert.alert(
          "Leave Test?",
          "Are you sure you want to leave? Your progress will be lost and you will receive 0 points.",
          [
            { text: "Stay", style: "cancel", onPress: () => {} },
            {
              text: "Leave",
              style: "destructive",
              onPress: () => navigation.dispatch(e.data.action),
            },
          ],
        );
      }
    });

    return unsubscribe;
  }, [navigation, isParticipant]);

  function onJoin(accessCode: string) {
    //TODO: Call backend with the code
    setIsParticipant(true);
  }

  function handleTestSubmit(answersArray: SubmittedAnswer[]) {
    const payload = {
      testId: Number(id),
      answers: answersArray,
    };

    console.log(
      "Submitting formatted payload to backend:",
      JSON.stringify(payload, null, 2),
    );

    // TODO: POST payload to backend, then redirect to a success/results screen
  }

  return (
    <ScreenWrapper>
      {!isParticipant ? (
        <JoinTest testId={Number(id)} onSubmit={onJoin} />
      ) : (
        <TestForm
          quiz={QUIZ_1}
          onSubmit={handleTestSubmit}
          timeLimitMinutes={60}
        />
      )}
    </ScreenWrapper>
  );
}
