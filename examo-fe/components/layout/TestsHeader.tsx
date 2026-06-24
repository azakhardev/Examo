import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import COLORS from "@/constants/colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type TestTab = "upcoming" | "history";

interface TestsHeaderProps {
  activeTab: TestTab;
  onTabChange: (tab: TestTab) => void;
}

export default function TestsHeader({
  activeTab,
  onTabChange,
}: TestsHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <Text style={styles.headerTitle}>Tests</Text>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "upcoming" && styles.activeTab]}
          onPress={() => onTabChange("upcoming")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "upcoming" && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => onTabChange("history")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.input,
    borderRadius: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.stroke,
  },
  tabText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },
  activeTabText: {
    color: COLORS.text,
  },
});
