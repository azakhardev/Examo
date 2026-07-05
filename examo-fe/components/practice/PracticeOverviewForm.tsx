import COLORS from "@/constants/colors";
import { PracticeMode, PracticeSetup } from "@/types/Practice";
import { Controller, useForm } from "react-hook-form";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

const MODES: PracticeMode[] = ["PRACTICE", "RACE", "FLASHCARDS"];
const QUESTION_TYPES = [
  "ALL",
  "SINGLE_CHOICE",
  "MULTIPLE_CHOICE",
  "OPEN",
  "TRUE_FALSE",
] as const;

type PracticeOverviewFormProps = {
  onSubmit: (data: PracticeSetup) => void;
};

function PracticeOverviewForm({ onSubmit }: PracticeOverviewFormProps) {
  const { control, handleSubmit, setValue, watch, getValues } =
    useForm<PracticeSetup>({
      defaultValues: {
        mode: "RACE",
        showCorrectAnswers: false,
        questionTimeLimit: 60,
        questionsType: "ALL",
        questionsRangeStart: 0,
        questionsRangeEnd: 125,
        shuffle: true,
      },
    });

  // Watch clickable values so the UI updates instantly
  const currentMode = watch("mode");
  const showCorrectAnswers = watch("showCorrectAnswers");
  const currentType = watch("questionsType");
  const shuffle = watch("shuffle");

  function handleToggleMode() {
    const nextIndex = (MODES.indexOf(currentMode) + 1) % MODES.length;
    setValue("mode", MODES[nextIndex]);
  }

  function handleToggleType() {
    const nextIndex =
      (QUESTION_TYPES.indexOf(currentType) + 1) % QUESTION_TYPES.length;
    setValue("questionsType", QUESTION_TYPES[nextIndex]);
  }

  function handleToggleCorrectAnswers() {
    setValue("showCorrectAnswers", !showCorrectAnswers);
  }

  function handleToggleShuffle() {
    setValue("shuffle", !shuffle);
  }

  return (
    <View>
      <View style={styles.setupContainer}>
        {/* Mode - Cycler */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Mode:</Text>
          <TouchableOpacity
            style={styles.settingValueBox}
            onPress={handleToggleMode}
          >
            <Text style={styles.settingValueText}>{currentMode}</Text>
          </TouchableOpacity>
        </View>

        {/* Show Correct Answers - Toggler */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Show Correct Answers:</Text>
          <TouchableOpacity
            style={styles.settingValueBox}
            onPress={handleToggleCorrectAnswers}
          >
            <Text style={styles.settingValueText}>
              {showCorrectAnswers ? "Yes" : "No"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Question Time Limit - Number Input */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Question Time Limit (s):</Text>
          <Controller
            control={control}
            name="questionTimeLimit"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.settingInputBox}
                keyboardType="numeric"
                value={value?.toString()}
                onChangeText={(text) => onChange(parseInt(text) || 0)}
                onBlur={onBlur}
              />
            )}
          />
        </View>

        {/* Questions Type - Cycler */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Questions Type:</Text>
          <TouchableOpacity
            style={styles.settingValueBox}
            onPress={handleToggleType}
          >
            <Text style={styles.settingValueText}>{currentType}</Text>
          </TouchableOpacity>
        </View>

        {/* Questions Range - Two Number Inputs */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Questions Range:</Text>
          <View style={styles.rangeContainer}>
            <Controller
              control={control}
              name="questionsRangeStart"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.smallRangeInput}
                  keyboardType="numeric"
                  value={value?.toString()}
                  onChangeText={(text) => onChange(parseInt(text) || 0)}
                  onBlur={onBlur}
                />
              )}
            />
            <Text style={styles.dashText}>-</Text>
            <Controller
              control={control}
              name="questionsRangeEnd"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.smallRangeInput}
                  keyboardType="numeric"
                  value={value?.toString()}
                  onChangeText={(text) => onChange(parseInt(text) || 0)}
                  onBlur={onBlur}
                />
              )}
            />
          </View>
        </View>

        {/* Shuffle - Toggler */}
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Shuffle:</Text>
          <TouchableOpacity
            style={styles.settingValueBox}
            onPress={handleToggleShuffle}
          >
            <Text style={styles.settingValueText}>
              {shuffle ? "Yes" : "No"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.startButtonText}>START</Text>
      </TouchableOpacity>

      <Text style={styles.historyTitle}>History</Text>
    </View>
  );
}
export default PracticeOverviewForm;

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  setupContainer: {
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  settingLabel: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  settingValueBox: {
    backgroundColor: COLORS.input,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: 160,
    alignItems: "center",
  },
  settingInputBox: {
    backgroundColor: COLORS.input,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: 160,
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  settingValueText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  rangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 160,
  },
  smallRangeInput: {
    backgroundColor: COLORS.input,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 8,
    flex: 1,
    textAlign: "center",
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  dashText: {
    color: COLORS.text,
    marginHorizontal: 8,
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    marginBottom: 32,
  },
  startButtonText: {
    color: COLORS.background,
    fontSize: 18,
    fontWeight: "bold",
  },
  historyTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
});
