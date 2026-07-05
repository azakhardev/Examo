// screens/CreateTestScreen.tsx
import React, { useState } from "react";
import { Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useForm } from "react-hook-form";
import COLORS from "@/constants/colors";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import Fab from "@/components/ui/Fab";
import PrintTestModal from "@/components/tests/PrintTestModal";
import { CreateTestFormSchema } from "@/types/CreateTest";
import CreateTestForm from "@/components/tests/CreateTestForm";

export default function CreateTestScreen() {
  const [isPrintModalVisible, setPrintModalVisible] = useState(false);

  const { control, handleSubmit, watch } = useForm<CreateTestFormSchema>({
    defaultValues: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      timeLimit: 60,
    },
  });

  const currentTitle = watch("title");
  const currentDescription = watch("description");

  const onCreateTest = (data: CreateTestFormSchema) => {
    console.log("Saving new test to backend:", data);
    // TODO: POST to backend
  };

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Create Test</Text>

        <CreateTestForm control={control} />

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleSubmit(onCreateTest)}
        >
          <Text style={styles.createButtonText}>CREATE</Text>
        </TouchableOpacity>
        <Fab
          icon="print-outline"
          backgroundColor={COLORS.secondary}
          iconColor={COLORS.background}
          onPress={() => setPrintModalVisible(true)}
          style={{ right: 0 }}
        />
      </ScrollView>

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
  container: { flex: 1 },
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
