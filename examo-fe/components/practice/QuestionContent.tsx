import COLORS from "@/constants/colors";
import { Question, QuestionOption } from "@/types/Question";
import { formatEnum } from "@/utils";
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

type QuestionContentProps = {
  question: Question;
  showCorrect: boolean;
  isSubmitted: boolean;
  onSelect: (text: string) => void;
  answers: Record<string, string | string[]>;
};

function QuestionContent({
  question,
  showCorrect,
  isSubmitted,
  onSelect,
  answers,
}: QuestionContentProps) {
  const renderOption = (opt: QuestionOption) => {
    const userAnswer = answers[question.id];
    const isSelected = Array.isArray(userAnswer)
      ? userAnswer.includes(opt.id)
      : userAnswer === opt.id;

    let backgroundColor = COLORS.input;
    let borderColor = COLORS.stroke;
    let iconColor = isSelected ? COLORS.text : COLORS.stroke;
    let textColor = isSelected ? COLORS.text : COLORS.textSecondary;

    if (isSubmitted && showCorrect) {
      if (opt.isCorrect) {
        backgroundColor = `${COLORS.success}20`; // 20% opacity green
        borderColor = COLORS.success;
        iconColor = COLORS.success;
        textColor = COLORS.success;
      } else if (isSelected && !opt.isCorrect) {
        backgroundColor = `${COLORS.danger}20`;
        borderColor = COLORS.danger;
        iconColor = COLORS.danger;
        textColor = COLORS.danger;
      }
    }

    const IconName =
      question.type === "MULTIPLE_CHOICE"
        ? isSelected
          ? "checkbox"
          : "square-outline"
        : isSelected
          ? "radio-button-on"
          : "ellipse-outline";

    return (
      <TouchableOpacity
        key={opt.id}
        style={[styles.optionRow, { backgroundColor, borderColor }]}
        onPress={() => onSelect(opt.id)}
        activeOpacity={0.7}
        disabled={isSubmitted}
      >
        <Ionicons name={IconName as any} size={24} color={iconColor} />
        <Text style={[styles.optionText, { color: textColor }]}>
          {opt.text}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOpenInput = () => {
    const userAnswer = (answers[question.id] as string) || "";
    let backgroundColor = COLORS.input;
    let borderColor = COLORS.stroke;
    let textColor = COLORS.text;

    const isCorrect = question.options?.some(
      (opt) =>
        opt.text.trim().toLowerCase() === userAnswer.trim().toLowerCase(),
    );

    if (isSubmitted && showCorrect) {
      if (isCorrect) {
        backgroundColor = `${COLORS.success}20`;
        borderColor = COLORS.success;
        textColor = COLORS.success;
      } else {
        backgroundColor = `${COLORS.danger}20`;
        borderColor = COLORS.danger;
        textColor = COLORS.danger;
      }
    }

    return (
      <View style={styles.openContainer}>
        <TextInput
          style={[
            styles.openInput,
            { backgroundColor, borderColor, color: textColor },
          ]}
          value={userAnswer}
          onChangeText={onSelect}
          editable={!isSubmitted}
          multiline
          placeholder="Type your answer here..."
          placeholderTextColor={COLORS.textSecondary}
          textAlignVertical="top"
        />

        {isSubmitted && showCorrect && (
          <View style={styles.acceptedContainer}>
            <Text style={styles.acceptedTitle}>Accepted Answers:</Text>
            {question.options?.map((opt) => (
              <View key={opt.id} style={styles.acceptedRow}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={COLORS.success}
                />
                <Text style={styles.acceptedText}>{opt.text}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.questionType}>{formatEnum(question.type)}</Text>
        <Text style={styles.questionText}>{question.questionText}</Text>

        <View style={styles.optionsContainer}>
          {question.type === "OPEN"
            ? renderOpenInput()
            : question.options?.map(renderOption)}
        </View>
      </View>
    </ScrollView>
  );
}

export default QuestionContent;

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  questionType: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  questionText: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    fontWeight: "500",
  },
  openContainer: {
    gap: 16,
  },
  openInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
  },
  acceptedContainer: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    gap: 8,
  },
  acceptedTitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  acceptedRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  acceptedText: {
    color: COLORS.success,
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
});
