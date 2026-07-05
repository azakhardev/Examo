import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

type EditQuestionHeaderProps = {
  onCancel: () => void;
  onSave: () => void;
};

function EditQuestionHeader({ onSave, onCancel }: EditQuestionHeaderProps) {
  return (
    <View style={styles.modalHeader}>
      <Text style={styles.modalTitle}>Edit Question</Text>
      <View style={styles.buttonsWrapper}>
        <TouchableOpacity style={styles.savePill} onPress={onSave}>
          <Ionicons name="checkmark" size={16} color={COLORS.background} />
          <Text style={styles.savePillText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel}>
          <Ionicons name="close" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default EditQuestionHeader;

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.stroke,
  },
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
  buttonsWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
});
