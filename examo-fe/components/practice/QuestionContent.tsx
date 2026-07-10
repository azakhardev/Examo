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
} from "react-native";

type QuestionContentProps = {
  question: Question;
  showCorrect: boolean;
  isSubmitted: boolean;
  onSelect: (id: string) => void;
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

    // Feedback Styling (Only if submitted AND showCorrectAnswers is on)
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

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        <Text style={styles.questionType}>{formatEnum(question.type)}</Text>
        <Text style={styles.questionText}>{question.questionText}</Text>

        <View style={styles.optionsContainer}>
          {question.options?.map(renderOption)}
        </View>
      </View>
    </ScrollView>
  );
}

export default QuestionContent;

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
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
});
