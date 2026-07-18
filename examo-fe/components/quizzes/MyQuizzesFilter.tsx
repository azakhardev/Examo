import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import COLORS from "@/constants/colors";
import { VisibilityFilter, QuizzesFilter } from "@/app/(tabs)/quizzes";

type MyQuizzesFilterProps = {
  visible: boolean;
  filter: QuizzesFilter;
  onFilterChange: (filter: QuizzesFilter) => void;
  onClose: () => void;
};

const ACCESS_LEVELS: VisibilityFilter[] = [
  "ALL",
  "PUBLIC",
  "RESTRICTED",
  "PRIVATE",
];

export default function MyQuizzesFilter({
  visible,
  filter,
  onFilterChange,
  onClose,
}: MyQuizzesFilterProps) {
  const handleAccessLevelChange = () => {
    const currentIndex = ACCESS_LEVELS.indexOf(filter.visibility);
    const next = ACCESS_LEVELS[(currentIndex + 1) % ACCESS_LEVELS.length];
    onFilterChange({ ...filter, visibility: next });
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  filter.isAuthor && styles.activeOption,
                ]}
                onPress={() =>
                  onFilterChange({ ...filter, isAuthor: !filter.isAuthor })
                }
              >
                <Text style={styles.optionText}>Only Mine</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.optionButton,
                  filter.isFavorite && styles.activeOption,
                ]}
                onPress={() =>
                  onFilterChange({ ...filter, isFavorite: !filter.isFavorite })
                }
              >
                <Text style={styles.optionText}>Only Favorite</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionButton}
                onPress={handleAccessLevelChange}
              >
                <Text style={styles.optionText}>
                  Visibility: {filter.visibility}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  modalTitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginBottom: 16,
  },
  optionButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  optionText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "600",
  },
  activeOption: {
    backgroundColor: COLORS.stroke,
  },
});
