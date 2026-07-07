import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Controller, Control } from "react-hook-form";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import { Question, QuestionType, QuestionOption } from "@/types/Question";
import { TestAnswers } from "./TestForm";
import { formatEnum } from "@/utils";

type QuestionCardProps = {
  question: Question;
  index: number;
  control: Control<TestAnswers>;
};

type SingleChoiceRendererProps = {
  options: QuestionOption[];
  selectedValue: string;
  onSelect: (id: string) => void;
  hasNegativePoints: boolean;
};

type MultipleChoiceRendererProps = {
  options: QuestionOption[];
  selectedValues: string[];
  onToggle: (newValues: string[]) => void;
  hasNegativePoints: boolean;
};

function QuestionCard({ question, index, control }: QuestionCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          Question #{index + 1} - {formatEnum(question.type as QuestionType)}
        </Text>
        <View style={styles.pointsContainer}>
          <Text style={styles.maxPointsText}>
            Points: {question.maxPoints}{" "}
            {question.negativePoints ? (
              <>
                |
                <Text style={styles.negativePointsText}>
                  {" "}
                  -{question.negativePoints}
                </Text>
              </>
            ) : null}
          </Text>
        </View>
      </View>

      <Text style={styles.questionText}>{question.questionText}</Text>

      <Controller
        control={control}
        name={question.id}
        render={({ field: { onChange, value } }) => {
          if (
            question.type === "SINGLE_CHOICE" ||
            question.type === "TRUE_FALSE"
          ) {
            return (
              <SingleChoiceRenderer
                options={question.options || []}
                selectedValue={value as string}
                onSelect={onChange}
                hasNegativePoints={!!question.negativePoints}
              />
            );
          }

          if (question.type === "MULTIPLE_CHOICE") {
            return (
              <MultipleChoiceRenderer
                options={question.options || []}
                selectedValues={(value as string[]) || []}
                onToggle={(newValues: string[]) => onChange(newValues)}
                hasNegativePoints={!!question.negativePoints}
              />
            );
          }

          if (question.type === "OPEN") {
            return (
              <TextInput
                style={styles.openInput}
                multiline
                value={(value as string) || ""}
                onChangeText={onChange}
                placeholder="Type your answer here..."
                placeholderTextColor={COLORS.textSecondary}
              />
            );
          }

          return <></>;
        }}
      />
    </View>
  );
}

export default QuestionCard;

function SingleChoiceRenderer({
  options,
  selectedValue,
  onSelect,
  hasNegativePoints,
}: SingleChoiceRendererProps) {
  const isSkipped = selectedValue === "skip";
  return (
    <View style={styles.optionsContainer}>
      {options.map((opt: QuestionOption) => {
        const isSelected = selectedValue === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            style={styles.optionRow}
            onPress={() => onSelect(opt.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isSelected ? "radio-button-on" : "ellipse"}
              size={22}
              color={isSelected ? COLORS.text : COLORS.stroke}
            />
            <Text
              style={[
                styles.optionText,
                isSelected && styles.optionTextSelected,
              ]}
            >
              {opt.text}
            </Text>
          </TouchableOpacity>
        );
      })}
      {hasNegativePoints && (
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => onSelect("skip")}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isSkipped ? "radio-button-on" : "ellipse"} // Using radio button styles
            size={22}
            color={isSkipped ? COLORS.text : COLORS.stroke}
          />
          <Text
            style={[styles.optionText, isSkipped && styles.optionTextSelected]}
          >
            Skip
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function MultipleChoiceRenderer({
  options,
  selectedValues,
  onToggle,
  hasNegativePoints,
}: MultipleChoiceRendererProps) {
  const handleToggle = (id: string) => {
    if (id === "skip") {
      onToggle(["skip"]);
      return;
    }

    let newValues = selectedValues.filter((v: string) => v !== "skip");
    if (newValues.includes(id)) {
      newValues = newValues.filter((v: string) => v !== id);
    } else {
      newValues.push(id);
    }
    onToggle(newValues);
  };

  const isSkipped = selectedValues.includes("skip");

  return (
    <View style={styles.optionsContainer}>
      {options.map((opt: QuestionOption) => {
        const isSelected = selectedValues.includes(opt.id);
        return (
          <TouchableOpacity
            key={opt.id}
            style={styles.optionRow}
            onPress={() => handleToggle(opt.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isSelected ? "checkbox" : "square"}
              size={22}
              color={isSelected ? COLORS.text : COLORS.stroke}
            />
            <Text
              style={[
                styles.optionText,
                isSelected && styles.optionTextSelected,
              ]}
            >
              {opt.text}
            </Text>
          </TouchableOpacity>
        );
      })}

      {hasNegativePoints && (
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => handleToggle("skip")}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isSkipped ? "checkbox" : "square"}
            size={22}
            color={isSkipped ? COLORS.text : COLORS.stroke}
          />
          <Text
            style={[styles.optionText, isSkipped && styles.optionTextSelected]}
          >
            Skip
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.input,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
    paddingRight: 8,
  },
  pointsContainer: {
    alignItems: "flex-end",
  },
  maxPointsText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: "bold",
  },
  negativePointsText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: "bold",
  },
  questionText: {
    color: COLORS.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: {
    color: COLORS.textSecondary,
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  optionTextSelected: {
    color: COLORS.text,
  },
  openInput: {
    backgroundColor: COLORS.background,
    borderColor: COLORS.stroke,
    borderWidth: 1,
    borderRadius: 6,
    color: COLORS.text,
    padding: 12,
    minHeight: 100,
    textAlignVertical: "top",
  },
});
