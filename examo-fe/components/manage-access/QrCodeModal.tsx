import {
  Modal,
  Pressable,
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import COLORS from "@/constants/colors";
import QRCode from "react-native-qrcode-svg";

type QrCodeModalProps = {
  visible: boolean;
  onHide: (v: boolean) => void;
  link: string;
};

function QrCodeModal({ visible, onHide, link }: QrCodeModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => onHide(false)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => onHide(false)}>
        <View
          style={styles.modalContent}
          onStartShouldSetResponder={() => true}
        >
          <Text style={styles.modalTitle}>Scan to join Quiz</Text>
          <View style={styles.qrWrapper}>
            <QRCode
              value={link}
              size={200}
              color="#000000"
              backgroundColor="#FFFFFF"
            />
          </View>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => onHide(false)}
          >
            <Text style={styles.closeModalText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

export default QrCodeModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 24,
  },
  closeModalButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  closeModalText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});
