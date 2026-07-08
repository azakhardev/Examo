import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import COLORS from "@/constants/colors";
import { router } from "expo-router";
import PrintTestModal from "./PrintTestModal";
import { Test } from "@/types/Test";

type TestSettingsModalProps = {
  uuid: string;
  id: string;
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  test?: Test;
};

export default function TestSettingsModal({
  uuid,
  id,
  visible,
  onClose,
  onDelete,
  test,
}: TestSettingsModalProps) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
    <>
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
                  style={styles.optionButton}
                  onPress={() => {
                    router.push({
                      pathname: "/quizzes/[uuid]/tests/[id]/edit",
                      params: { uuid: uuid, id: id },
                    });
                    onClose();
                  }}
                >
                  <Text style={styles.optionText}>Edit test</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    setIsVisible(true);
                    onClose();
                  }}
                >
                  <Text style={styles.optionText}>Print test</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionButton, styles.deleteButton]}
                  onPress={() => {
                    onDelete();
                    onClose();
                  }}
                >
                  <Text style={styles.deleteText}>DELETE</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <PrintTestModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
        initialTitle={test?.title}
        initialDescription={test?.description}
      />
    </>
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
  deleteButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.stroke,
    marginTop: 8,
    marginBottom: 0,
  },
  deleteText: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: "bold",
  },
});
