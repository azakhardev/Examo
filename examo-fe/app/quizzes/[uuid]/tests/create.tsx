// screens/CreateTestScreen.tsx
import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import COLORS from "@/constants/colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import Fab from "@/components/ui/Fab";
import PrintTestModal from "@/components/tests/PrintTestModal";
import { CreateTestPayload } from "@/types/CreateTest";
import CreateTestForm from "@/components/tests/CreateTestForm";
import useCreateTest from "@/api/tests/useCreateTest";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import { queryClient } from "@/components/providers/QueryProvider";
import { queryKeys } from "@/api/queryKeys";

export default function CreateTestScreen() {
  const { uuid } = useLocalSearchParams();
  const [isPrintModalVisible, setPrintModalVisible] = useState(false);

  const { control, handleSubmit, watch, resetField } =
    useForm<CreateTestPayload>({
      defaultValues: {
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        timeLimit: 60,
        questionsCount: 10,
        allowReview: false,
        maxPoints: 0,
      },
    });

  const currentTitle = watch("title");
  const currentDescription = watch("description");

  const { mutate, isPending } = useCreateTest();

  function handleCreateTest(data: CreateTestPayload) {
    mutate(
      {
        ...data,
        description: currentDescription,
        title: currentTitle,
        quizId: uuid as string,
      },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: "Created successfully",
            text2:
              "Your test was created successfully, continue by creating next one",
          });
          resetField("startTime");
          resetField("endTime");
          queryClient.resetQueries({ queryKey: queryKeys.quizzes.tests });
        },
        onError: (e) => {
          Toast.show({
            type: "error",
            text1: "Creation failed",
            text2: e.message,
          });
        },
      },
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.screenTitle}>Create Test</Text>

        <CreateTestForm control={control} />

        <TouchableOpacity
          style={[
            styles.createButton,
            isPending && { backgroundColor: COLORS.disabled },
          ]}
          onPress={handleSubmit(handleCreateTest)}
          disabled={isPending}
        >
          <Text style={styles.createButtonText}>CREATE</Text>
        </TouchableOpacity>
      </ScrollView>
      <Fab
        icon="print-outline"
        backgroundColor={COLORS.secondary}
        iconColor={COLORS.background}
        onPress={() => setPrintModalVisible(true)}
        style={{ bottom: 50 }}
      />
      {/* Print Modal */}
      <PrintTestModal
        visible={isPrintModalVisible}
        onClose={() => setPrintModalVisible(false)}
        initialTitle={currentTitle}
        initialDescription={currentDescription}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  screenTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },

  createButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 16,
  },
  createButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});
