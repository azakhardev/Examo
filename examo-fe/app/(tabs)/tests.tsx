import TestsHeader from "@/components/layout/TestsHeader";
import COLORS from "@/constants/colors";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

function Tests() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "history">(
    "upcoming",
  );

  const tests: string[] = [];

  return (
    <>
      <TestsHeader
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />
      <View style={styles.container}>
        <FlatList data={tests} renderItem={(i) => <View></View>}></FlatList>
      </View>
    </>
  );
}

export default Tests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
});
