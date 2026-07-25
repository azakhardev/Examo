import React, { useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { usePreventRemove } from "@react-navigation/native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import JoinTest from "@/components/tests/JoinTest";
import TestForm, { SubmittedAnswer } from "@/components/tests/TestForm";

import { Alert } from "react-native";
import useGetTestSession from "@/api/tests/useGetTestSession";
import Loader from "@/components/ui/Loader";
import ErrorView from "@/components/ui/ErrorView";

export default function ParticipateTestScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isError, error } = useGetTestSession(Number(id));

  const shouldPreventLeaving = data?.isParticipating === true && !isSubmitting;

  console.log(data);

  usePreventRemove(shouldPreventLeaving, (e) => {
    Alert.alert(
      "Leave Test?",
      "Are you sure you want to leave? Your progress will be lost and you will receive 0 points.",
      [
        { text: "Stay", style: "cancel", onPress: () => {} },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => navigation.dispatch(e.data.action), // Allows them to leave
        },
      ],
    );
  });

  function handleTestSubmit(answersArray: SubmittedAnswer[]) {
    setIsSubmitting(true);

    const payload = {
      testId: Number(id),
      answers: answersArray,
    };

    console.log(
      "Submitting formatted payload to backend:",
      JSON.stringify(payload, null, 2),
    );

    // TODO: POST payload to backend
    // After success: router.replace("/tests/success");
  }

  if (isError) {
    return <ErrorView error={error} />;
  }

  return (
    <ScreenWrapper>
      {isLoading ? (
        <Loader />
      ) : !data?.isParticipating ? (
        <JoinTest testId={Number(id)} />
      ) : (
        <TestForm session={data.test} onSubmit={handleTestSubmit} />
      )}
    </ScreenWrapper>
  );
}
