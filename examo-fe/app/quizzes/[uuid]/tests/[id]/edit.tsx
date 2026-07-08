// screens/CreateTestScreen.tsx
import React from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import COLORS from "@/constants/colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import { TestFormSchema } from "@/types/CreateTest";
import CreateTestForm from "@/components/tests/CreateTestForm";
import { upcoming_test } from "@/constants/mocks";

export default function EditTestScreen() {
  const test = upcoming_test; //TODO: Fetch test

  const { control, handleSubmit, watch } = useForm<TestFormSchema>({
    defaultValues: test,
  });

  const currentTitle = watch("title");
  const currentDescription = watch("description");

  const handleSaveChanges = (data: TestFormSchema) => {
    console.log("Saving updated info about test to backend:", {
      ...data,
      description: currentDescription,
      title: currentTitle,
    });
    // TODO: POST to backend
  };

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Edit Test</Text>

        <CreateTestForm control={control} />

        <TouchableOpacity
          style={styles.editButton}
          onPress={handleSubmit(handleSaveChanges)}
        >
          <Text style={styles.editButtonText}>SAVE</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  screenTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 24,
  },

  editButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 16,
  },
  editButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});
