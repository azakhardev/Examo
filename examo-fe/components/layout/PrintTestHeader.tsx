import COLORS from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type PrintTestHeaderProps = {
  onClose: () => void;
};

function PrintTestHeader({ onClose }: PrintTestHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Print Test</Text>
      <TouchableOpacity onPress={onClose}>
        <Ionicons name="close" size={24} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}

export default PrintTestHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: COLORS.stroke,
  },
  headerTitle: {
    color: COLORS.textSecondary,
    fontSize: 18,
    fontWeight: "bold",
  },
});
