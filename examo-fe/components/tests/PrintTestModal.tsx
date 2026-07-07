// components/tests/PrintTestModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import { PrintTestFormSchema } from "@/types/CreateTest";
import PrintTestHeader from "../layout/PrintTestHeader";

type PrintTestModalProps = {
  visible: boolean;
  onClose: () => void;
  initialTitle?: string;
  initialDescription?: string;
};

export default function PrintTestModal({
  visible,
  onClose,
  initialTitle,
  initialDescription,
}: PrintTestModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const { control, handleSubmit } = useForm<PrintTestFormSchema>({
    defaultValues: {
      title: initialTitle || "",
      description: initialDescription || "",
      date: "",
      testsCount: 10,
      questionsPerTest: 6,
      questionsPerPage: 3,
      pagination: false,
      identificationCode: false,
      variants: false,
    },
  });

  const onDownload = async (data: PrintTestFormSchema) => {
    //TODO: Post to backend
    setIsDownloading(true);
    console.log("Sending to backend to generate PDF...", data);

    setTimeout(() => {
      setIsDownloading(false);
      console.log("PDF Downloaded!");
      onClose();
    }, 3000);
  };

  const CheckboxRow = ({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <View style={styles.checkboxRow}>
      <Text style={styles.checkboxLabel}>{label}</Text>
      <TouchableOpacity onPress={() => onChange(!value)}>
        <Ionicons
          name={value ? "checkbox" : "square-outline"}
          size={24}
          color={value ? COLORS.text : COLORS.stroke}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <PrintTestHeader onClose={onClose} />

        <ScrollView contentContainerStyle={styles.formContainer}>
          <Text style={styles.label}>Title</Text>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
              />
            )}
          />

          <Text style={styles.label}>Description</Text>
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                value={value}
                onChangeText={onChange}
                multiline
                textAlignVertical="top"
              />
            )}
          />

          {/* TODO: Replace with datepicker */}
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Controller
              control={control}
              name="date"
              render={({ field: { onChange, value } }) => (
                <View style={styles.iconInputContainer}>
                  <TextInput
                    style={styles.flexInput}
                    value={value}
                    onChangeText={onChange}
                    placeholder="DD.MM.YYYY"
                    placeholderTextColor={COLORS.textSecondary}
                  />
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </View>
              )}
            />
          </View>

          {(
            ["testsCount", "questionsPerTest", "questionsPerPage"] as const
          ).map((fieldName, idx) => {
            const labels = [
              "Tests count:",
              "Questions per test:",
              "Questions per page:",
            ];
            return (
              <View style={styles.row} key={fieldName}>
                <Text style={styles.label}>{labels[idx]}</Text>
                <Controller
                  control={control}
                  name={fieldName}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.numericInput}
                      value={value?.toString()}
                      onChangeText={(val) => onChange(parseInt(val) || 0)}
                      keyboardType="numeric"
                    />
                  )}
                />
              </View>
            );
          })}

          <Controller
            control={control}
            name="pagination"
            render={({ field: { onChange, value } }) => (
              <CheckboxRow
                label="Pagination:"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="identificationCode"
            render={({ field: { onChange, value } }) => (
              <CheckboxRow
                label="Identification Code:"
                value={value}
                onChange={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="variants"
            render={({ field: { onChange, value } }) => (
              <CheckboxRow
                label="Variants:"
                value={value}
                onChange={onChange}
              />
            )}
          />
        </ScrollView>

        <TouchableOpacity
          style={styles.downloadFab}
          onPress={handleSubmit(onDownload)}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Ionicons
              name="download-outline"
              size={24}
              color={COLORS.background}
            />
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: COLORS.background },

  formContainer: { padding: 16, paddingBottom: 100 },
  label: {
    color: COLORS.text,
    fontWeight: "bold",
    marginBottom: 8,
    fontSize: 14,
  },
  input: {
    backgroundColor: COLORS.input,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 6,
    color: COLORS.text,
    padding: 12,
    marginBottom: 16,
  },
  textArea: { minHeight: 80 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.input,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    width: 150,
  },
  flexInput: { flex: 1, color: COLORS.text, paddingVertical: 10 },
  numericInput: {
    backgroundColor: COLORS.input,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 6,
    color: COLORS.text,
    paddingVertical: 10,
    paddingHorizontal: 12,
    width: 150,
    textAlign: "center",
  },
  checkboxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  checkboxLabel: { color: COLORS.text, fontWeight: "bold", fontSize: 14 },
  downloadFab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: COLORS.success,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
});
