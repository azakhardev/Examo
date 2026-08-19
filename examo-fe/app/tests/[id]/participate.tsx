import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Client } from "@stomp/stompjs";
import Toast from "react-native-toast-message";
import { useAuth } from "@/components/providers/AuthProvider";

//TODO: Replace with .env
const BASE_URL = "192.168.0.61:8080";

export default function ParticipateTestScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate } = useSubmitTest(Number(id));
  const { data, isLoading, isError, error } = useGetTestSession(Number(id));

  // --- WebSocket Setup ---
  const stompClient = useRef<Client | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    // Only connect if the user is actively participating
    if (!data?.isParticipating || !data?.test) return;

    const client = new Client({
      brokerURL: `ws://${BASE_URL}/ws`,
      connectHeaders: { Authorization: `Bearer ${token}` },

      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
      onConnect: () => {
        console.log("STOMP: Connected successfully!");

        const initialPayload = {
          answers: 0,
          totalQuestions: data?.test?.questions?.length || 0,
        };

        client.publish({
          destination: `/app/tests/${id}/progress`,
          body: JSON.stringify(initialPayload),
        });
      },
      onDisconnect: () => {
        console.log("STOMP: Disconnected");
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, [data?.isParticipating, id, token]);

  // --- Progress Broadcast Function ---
  const handleProgressUpdate = useCallback(
    (answersCount: number) => {
      if (!stompClient.current?.connected || !data?.test) return;

      const payload = {
        answers: answersCount,
        totalQuestions: data.test.questions?.length || 0,
      };

      stompClient.current.publish({
        destination: `/app/tests/${id}/progress`,
        body: JSON.stringify(payload),
      });
    },
    [data?.test, id],
  );

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
          onProgressUpdate={handleProgressUpdate}
        />
      )}
    </ScreenWrapper>
  );
}
