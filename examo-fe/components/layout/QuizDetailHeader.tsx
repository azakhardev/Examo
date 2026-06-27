import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type QuizDetailHeaderProps = {
  title: string;
  isFavorite: boolean;
  isEditing: boolean;
  onFavoriteToggle: () => void;
  onSettingsPress: () => void;
};

export default function QuizDetailHeader({
  title,
  isFavorite,
  isEditing,
  onFavoriteToggle,
  onSettingsPress,
}: QuizDetailHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {!isEditing && (
        <TouchableOpacity
          onPress={onFavoriteToggle}
          style={styles.favoriteButton}
        >
          <Ionicons
            name={isFavorite ? "star" : "star-outline"}
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      )}

      {!isEditing && (
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={onSettingsPress}
          activeOpacity={0.7}
        >
          <Ionicons name="settings-outline" size={16} color={COLORS.primary} />
          <Text style={styles.settingsText}>Settings</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    gap: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: "bold",
    flexShrink: 1,
  },
  editIcon: {
    marginRight: 8,
  },
  favoriteButton: {
    marginLeft: 8,
    padding: 4,
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    marginTop: 2,
  },
  settingsText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});
