import COLORS from "@/constants/colors";
import { Question, QuestionType, QuestionOption } from "@/types/Question";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
} from "react-native";
import EditQuestionHeader from "../layout/EditQuestionHeader";
import { useEffect } from "react";

const INPUT_MAPPER: Record<QuestionType, React.FC<InputProps>> = {
  MULTIPLE_CHOICE: MultipleChoiceInput,
  SINGLE_CHOICE: SingleChoiceInput,
  TRUE_FALSE: TrueFalseInput,
  OPEN: OpenInput,
};

type QuestionEditorProps = {
  question: Question;
  onSave: (data: Question) => void;
  onCancel: () => void;
};

function QuestionEditor({ question, onSave, onCancel }: QuestionEditorProps) {
  const { control, handleSubmit, setValue, watch } = useForm<Question>({
    defaultValues: {
      ...question,
    },
  });

  const { fields, append, remove, update, replace } = useFieldArray({
    control,
    name: "options",
  });

  const type = watch("type");

  useEffect(() => {
    if (type === "TRUE_FALSE") {
      setValue("options", [
        { id: "q1", text: "True", isCorrect: true },
        { id: "q2", text: "False", isCorrect: false },
      ]);
    } else {
      setValue("options", question.options);
    }
  }, [setValue, type, question.options]);

  function handleToggleType() {
    const types = Object.keys(INPUT_MAPPER) as QuestionType[];
    const nextIndex = (types.indexOf(type as QuestionType) + 1) % types.length;
    const nextType = types[nextIndex];

    setValue("type", nextType);
  }

  function handleToggleCorrect(index: number, currentOption: QuestionOption) {
    if (type === "SINGLE_CHOICE" || type === "TRUE_FALSE") {
      const updatedOptions = fields.map((field, i) => ({
        ...field,
        isCorrect: i === index,
      }));
      replace(updatedOptions);
    } else {
      update(index, { ...currentOption, isCorrect: !currentOption.isCorrect });
    }
  }

  function handleOptionTextChange(
    index: number,
    currentOption: QuestionOption,
    text: string,
  ) {
    update(index, { ...currentOption, text });
  }

  function handleSave() {
    handleSubmit((data) => {
      onSave(data);
    })();
  }

  return (
    <View style={styles.modalContainer}>
      <EditQuestionHeader onSave={handleSave} onCancel={onCancel} />

      <ScrollView contentContainerStyle={styles.modalContent}>
        <Text style={styles.labelTitle}>Question Text:</Text>
        <Controller
          control={control}
          name="questionText"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.textArea}
              multiline
              textAlignVertical="top"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <View style={styles.row}>
          <Text style={styles.labelTitle}>Question Type:</Text>
          <TouchableOpacity style={styles.inputBox} onPress={handleToggleType}>
            <Text style={styles.valueText}>{type}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.labelTitle}>Maximum Points:</Text>
          <Controller
            control={control}
            name="maxPoints"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.smallInput}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                value={value.toString()}
              />
            )}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.labelTitle}>Negative Points:</Text>
          <Controller
            control={control}
            name="negativePoints"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.smallInput}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
                value={value?.toString() ?? "0"}
              />
            )}
          />
        </View>

        {/* TODO: Image Selector */}
        <View style={styles.row}>
          <Text style={styles.labelTitle}>Image:</Text>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.textSecondary}>MMU.jpg</Text>
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.labelTitle}>Question Options:</Text>
          {type !== "TRUE_FALSE" && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                append({
                  id: `q${fields.length + 1}`,
                  text: "",
                  isCorrect: type === "OPEN" ? true : false,
                })
              }
            >
              <Ionicons name="add" size={16} color={COLORS.background} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.optionSection}>
          {fields.map((field, index) => {
            const Component = INPUT_MAPPER[type as QuestionType];

            if (!Component) return null;

            return (
              <Component
                key={index}
                value={field.text}
                isCorrect={field.isCorrect}
                onCheck={() => handleToggleCorrect(index, field)}
                onChange={(text) => handleOptionTextChange(index, field, text)}
                onDelete={() => remove(index)}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

type InputProps = {
  value: string;
  isCorrect?: boolean;
  onCheck?: () => void;
  onChange?: (text: string) => void;
  onDelete?: () => void;
};

function MultipleChoiceInput({
  value,
  isCorrect,
  onCheck,
  onChange,
  onDelete,
}: InputProps) {
  return (
    <View style={styles.optionRow}>
      <TouchableOpacity onPress={onCheck}>
        <Ionicons
          name={isCorrect ? "checkbox" : "square-outline"}
          size={24}
          color={isCorrect ? COLORS.primary : COLORS.textSecondary}
        />
      </TouchableOpacity>

      <TextInput
        style={styles.optionInput}
        value={value}
        onChangeText={onChange}
        placeholder="Enter option..."
        placeholderTextColor={COLORS.textSecondary}
      />

      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );
}

function SingleChoiceInput({
  value,
  isCorrect,
  onCheck,
  onChange,
  onDelete,
}: InputProps) {
  return (
    <View style={styles.optionRow}>
      <TouchableOpacity onPress={onCheck}>
        <Ionicons
          name={isCorrect ? "radio-button-on" : "ellipse-outline"}
          size={24}
          color={isCorrect ? COLORS.primary : COLORS.textSecondary}
        />
      </TouchableOpacity>

      <TextInput
        style={styles.optionInput}
        value={value}
        onChangeText={onChange}
        placeholder="Enter option..."
        placeholderTextColor={COLORS.textSecondary}
      />

      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );
}

function TrueFalseInput({ value, isCorrect, onCheck }: InputProps) {
  return (
    <View style={styles.optionRow}>
      <TouchableOpacity onPress={onCheck}>
        <Ionicons
          name={isCorrect ? "radio-button-on" : "ellipse-outline"}
          size={24}
          color={isCorrect ? COLORS.primary : COLORS.textSecondary}
        />
      </TouchableOpacity>

      <Text style={{ color: COLORS.text, fontWeight: 600 }}>{value}</Text>
    </View>
  );
}

function OpenInput({ value, onChange, onDelete }: InputProps) {
  return (
    <View style={styles.optionRow}>
      <TextInput
        style={styles.optionInput}
        value={value}
        onChangeText={onChange}
        placeholder="Enter accepted answer..."
        placeholderTextColor={COLORS.textSecondary}
      />
      <TouchableOpacity onPress={onDelete}>
        <Ionicons name="trash-outline" size={20} color={COLORS.danger} />
      </TouchableOpacity>
    </View>
  );
}

export default QuestionEditor;

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: COLORS.background },
  modalContent: { padding: 16 },
  labelTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: COLORS.input,
    color: COLORS.text,
    padding: 12,
    borderRadius: 8,
    minHeight: 100,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  valueText: { color: COLORS.textSecondary },
  smallInput: {
    backgroundColor: COLORS.input,
    padding: 8,
    borderRadius: 6,
    width: 80,
    textAlign: "center",
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  imagePlaceholder: {
    backgroundColor: COLORS.input,
    padding: 8,
    borderRadius: 6,
    width: 120,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  textSecondary: { color: COLORS.textSecondary },
  optionSection: { marginTop: 20 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  optionInput: {
    flex: 1,
    backgroundColor: COLORS.input,
    padding: 8,
    borderRadius: 6,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  saveButton: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
  },
  saveButtonText: { color: COLORS.background, fontWeight: "bold" },

  inputBox: {
    backgroundColor: COLORS.input,
    padding: 10,
    borderRadius: 6,
    minWidth: 120,
    alignItems: "center",
  },
  optionRowUnderline: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.stroke,
    paddingVertical: 12,
    gap: 10,
  },
  optionInputUnderline: { flex: 1, color: COLORS.text, fontSize: 16 },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  addButtonText: {
    color: COLORS.background,
    fontWeight: "bold",
    fontSize: 14,
  },
});
