import { StyleSheet, View, Text } from "react-native";
import COLORS from "@/constants/colors";
import Tabs, { TabItem } from "../ui/Tabs";

interface TestsHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: TabItem[];
}

export default function TestsHeader({
  activeTab,
  onTabChange,
  tabs,
}: TestsHeaderProps) {
  return (
    <View style={[styles.header]}>
      <Text style={styles.headerTitle}>Tests</Text>

      <Tabs activeTab={activeTab} onTabChange={onTabChange} tabs={tabs} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 16,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: 16,
  },
});
