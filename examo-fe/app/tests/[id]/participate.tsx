import React, { useState } from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { usePreventRemove } from "@react-navigation/native";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import JoinTest from "@/components/tests/JoinTest";
import TestForm from "@/components/tests/TestForm";

import { Alert } from "react-native";
import useGetTestSession from "@/api/tests/useGetTestSession";
import Loader from "@/components/ui/Loader";
import ErrorView from "@/components/ui/ErrorView";
import useSubmitTest, { SubmittedAnswer } from "@/api/tests/useSubmitTest";
import Toast from "react-native-toast-message";

export default function ParticipateTestScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate } = useSubmitTest(Number(id));
  const { data, isLoading, isError, error } = useGetTestSession(Number(id));

  const shouldPreventLeaving = data?.isParticipating === true && !isSubmitting;

  usePreventRemove(shouldPreventLeaving, (e) => {
    Alert.alert(
      "Leave Test?",
      "Are you sure you want to leave? Your progress will be lost and you will receive 0 points.",
      [
        { text: "Stay", style: "cancel", onPress: () => {} },
        {
          text: "Leave",
          style: "destructive",
          onPress: () => {
            mutate([]);
            navigation.dispatch(e.data.action);
          },
        },
      ],
    );
  });

  function handleTestSubmit(answersArray: SubmittedAnswer[]) {
    setIsSubmitting(true);
    console.log(answersArray);

    mutate(answersArray, {
      onSuccess: (gainedPoints) => {
        router.replace({
          pathname: "/tests/[id]/success",
          params: { score: gainedPoints, id: Number(id) },
        });
      },
      onError: (error) => {
        setIsSubmitting(false);
        Toast.show({
          type: "error",
          text1: "Submission Failed",
          text2: error.message,
        });
      },
    });
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
        <TestForm
          session={data.test}
          onSubmit={handleTestSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </ScreenWrapper>
  );
}
