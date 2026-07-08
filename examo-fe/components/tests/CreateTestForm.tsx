import COLORS from "@/constants/colors";
import { TestFormSchema } from "@/types/CreateTest";
import { Ionicons } from "@expo/vector-icons";
import { Control, Controller } from "react-hook-form";
import { View, Text, TextInput, StyleSheet } from "react-native";

type CreateTestFormProps = {
  control: Control<TestFormSchema>;
};

function CreateTestForm({ control }: CreateTestFormProps) {
  return (
    <View>
      <Text style={styles.label}>Title</Text>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="New Test"
            placeholderTextColor={COLORS.textSecondary}
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
            placeholder="Lets test you!"
            placeholderTextColor={COLORS.textSecondary}
            value={value}
            onChangeText={onChange}
            multiline
            textAlignVertical="top"
          />
        )}
      />

      {/* TODO: Replace with datepicker */}
      <Text style={styles.label}>Start Time</Text>
      <Controller
        control={control}
        name="startTime"
        render={({ field: { onChange, value } }) => (
          <View style={styles.iconInputContainer}>
            <TextInput
              style={styles.flexInput}
              placeholder="01.04.2026 12:00"
              placeholderTextColor={COLORS.textSecondary}
              value={value}
              onChangeText={onChange}
            />
            <Ionicons
              name="calendar-outline"
              size={20}
              color={COLORS.textSecondary}
            />
          </View>
        )}
      />

      {/* TODO: Replace with datepicker */}
      <Text style={styles.label}>End Time</Text>
      <Controller
        control={control}
        name="endTime"
        render={({ field: { onChange, value } }) => (
          <View style={styles.iconInputContainer}>
            <TextInput
              style={styles.flexInput}
              placeholder="01.04.2026 12:01"
              placeholderTextColor={COLORS.textSecondary}
              value={value}
              onChangeText={onChange}
            />
            <Ionicons
              name="calendar-outline"
              size={20}
              color={COLORS.textSecondary}
            />
          </View>
        )}
      />

      <Text style={styles.label}>Time Limit</Text>
      <Controller
        control={control}
        name="timeLimit"
        render={({ field: { onChange, value } }) => (
          <View style={styles.iconInputContainer}>
            <TextInput
              style={styles.flexInput}
              keyboardType="numeric"
              value={value?.toString()}
              onChangeText={(val) => onChange(parseInt(val) || 0)}
            />
            <Text style={styles.unitText}>min</Text>
          </View>
        )}
      />
    </View>
  );
}

export default CreateTestForm;

const styles = StyleSheet.create({
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
  textArea: { minHeight: 100 },
  iconInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.input,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  flexInput: { flex: 1, color: COLORS.text, paddingVertical: 12 },
  unitText: { color: COLORS.textSecondary, fontSize: 14 },
});
