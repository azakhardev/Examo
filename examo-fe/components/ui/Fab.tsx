import { Ionicons } from "@expo/vector-icons";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import COLORS from "@/constants/colors";

type FabProps = {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  backgroundColor?: string;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export default function Fab({
  icon,
  onPress,
  backgroundColor = COLORS.primary,
  iconColor = COLORS.background,
  style,
  disabled = false,
}: FabProps) {
  return (
    <TouchableOpacity
      style={[
        styles.fab,
        { backgroundColor: disabled ? COLORS.textSecondary : backgroundColor },
        disabled && styles.disabledFab,
        style,
      ]}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
    >
      <Ionicons name={icon} size={32} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  disabledFab: {
    opacity: 0.5,
    elevation: 0,
    shadowOpacity: 0,
  },
});
