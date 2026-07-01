import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import COLORS from "@/constants/colors";

export type TabItem = {
  id: string;
  value: string;
};

type TabsProps = {
  activeTab: string;
  tabs: TabItem[];
  onTabChange: (key: string) => void;
};

function Tabs({ activeTab, tabs, onTabChange }: TabsProps) {
  return (
    <View style={styles.tabsContainer}>
      {tabs.map((t) => {
        return (
          <TouchableOpacity
            key={t.id}
            style={[styles.tab, activeTab === t.id && styles.activeTab]}
            onPress={() => onTabChange(t.id)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === t.id && styles.activeTabText,
              ]}
            >
              {t.value}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default Tabs;

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
