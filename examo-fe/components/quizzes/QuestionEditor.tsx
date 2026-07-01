import COLORS from "@/constants/colors";
import { Question } from "@/types/Question";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";

import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextInput,
  ScrollView,
} from "react-native";

const INPUT_MAPPER: Record<string, React.FC<InputProps>> = {
  MULTIPLE_CHOICE: MultipleChoiceInput,
  SINGLE_CHOICE: SingleChoiceInput,
  TRUE_FALSE: TrueFalseInput, // Reusing SingleChoice style for True/False
  OPEN: OpenInput,
};
type QuestionEditorProps = {
  question: Question;
  setQuestion: React.Dispatch<React.SetStateAction<Question | null>>;
  onSave: () => void;
  onCancel: () => void;
};

export type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
};

function QuestionEditor({
  question,
  setQuestion,
  onSave,
  onCancel,
}: QuestionEditorProps) {
  return (
    <View style={styles.modalContainer}>
      {/* Header */}
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.modalTitle}>Edit Question</Text>
        <TouchableOpacity style={styles.savePill} onPress={onSave}>
          <Ionicons name="checkmark" size={16} color={COLORS.background} />
          <Text style={styles.savePillText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.modalContent}>
        <Text style={styles.labelTitle}>Question Text:</Text>
        <TextInput
          style={styles.textArea}
          multiline
          textAlignVertical="top"
          value={question.questionText}
        />

        <View style={styles.row}>
          <Text style={styles.labelTitle}>Question Type:</Text>
          <TouchableOpacity style={styles.inputBox}>
            <Text style={styles.valueText}>{question.type}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <Text style={styles.labelTitle}>Maximum Points:</Text>
          <TextInput
            style={styles.smallInput}
            keyboardType="numeric"
            value={question.maxPoints.toString()}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.labelTitle}>Negative Points:</Text>
          <TextInput
            style={styles.smallInput}
            keyboardType="numeric"
            value={(question.negativePoints || 0).toString()}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.labelTitle}>Image:</Text>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.textSecondary}>MMU.jpg</Text>
          </View>
        </View>

        {/* --- Conditional Option Variants --- */}

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.labelTitle}>Question Options:</Text>
          {question.type !== "TRUE_FALSE" && (
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="add" size={16} color={COLORS.background} />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.optionSection}>
          {question.options?.map((opt, i) => {
            const Component = INPUT_MAPPER[question.type];
            return Component ? <Component key={i} value={opt} /> : null;
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
  onChange?: () => void;
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
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.stroke,
  },
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
  cancelText: { color: COLORS.textSecondary, fontSize: 16 },
  modalTitle: { color: COLORS.text, fontSize: 16, fontWeight: "bold" },
  savePill: {
    flexDirection: "row",
    backgroundColor: COLORS.success,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    gap: 4,
  },
  savePillText: { color: COLORS.background, fontWeight: "bold" },
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
