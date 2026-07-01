import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import Tabs from "@/components/ui/Tabs";
import { QuizParticipant } from "@/types/QuizParticipant";
import COLORS from "@/constants/colors";
import { INITIAL_SHARES, QUIZ_1 } from "@/constants/mocks";
import ParticipantCard from "@/components/manage-access/ParticipantCard";
import QrCodeModal from "@/components/manage-access/QrCodeModal";
import { useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import ScreenWrapper from "@/components/layout/ScreenWrapper";

function ManageAccessScreen() {
  const { uuid }: { uuid: string } = useLocalSearchParams();

  const quiz = QUIZ_1; //TODO:Fetch data

  const [activeTab, setActiveTab] = useState<string>("users");
  const [shares, setShares] = useState<QuizParticipant[]>(INITIAL_SHARES);
  const [modalVisible, setModalVisible] = useState(false);
  const [accessLevel, setAccessLevel] = useState<string>(quiz.visibility ?? "");

  // Filter lists based on block status
  const activeUsers = shares.filter((s) => !s.blocked);
  const blockedUsers = shares.filter((s) => s.blocked);

  async function handleCopyLink() {
    try {
      await Clipboard.setStringAsync(quiz.link!);

      Alert.alert(
        "Link Copied",
        "The quiz link has been copied to your clipboard.",
      );
    } catch (error) {
      Alert.alert("Error", "Failed to copy the link.");
    }
  }

  function handleChangeGlobalAccess() {
    const levels: ("PRIVATE" | "PUBLIC" | "RESTRICTED")[] = [
      "PRIVATE",
      "PUBLIC",
      "RESTRICTED",
    ];
    const nextIndex =
      (levels.indexOf(accessLevel as "PRIVATE" | "PUBLIC" | "RESTRICTED") + 1) %
      levels.length;
    setAccessLevel(levels[nextIndex]);
  }

  function handleEditAccess(share: QuizParticipant) {
    Alert.alert(
      "Change Access",
      `Change access level for ${share.user.username}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Toggle Read/Edit",
          onPress: () => {
            setShares((prev) =>
              prev.map((s) =>
                s.id === share.id
                  ? {
                      ...s,
                      access_level: s.access_level === "READ" ? "EDIT" : "READ",
                    }
                  : s,
              ),
            );
          },
        },
      ],
    );
  }

  function handleBlockUser(share: QuizParticipant) {
    Alert.alert(
      "Block User",
      `Are you sure you want to block ${share.user.username}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: () => {
            setShares((prev) =>
              prev.map((s) =>
                s.id === share.id
                  ? { ...s, blocked: true, access_level: "Blocked" }
                  : s,
              ),
            );
          },
        },
      ],
    );
  }

  function handleRemoveUser(share: QuizParticipant) {
    Alert.alert(
      "Remove User",
      `Are you sure you want to remove ${share.user.username}'s access?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setShares((prev) => prev.filter((s) => s.id !== share.id));
          },
        },
      ],
    );
  }

  function handleUnblockUser(share: QuizParticipant) {
    Alert.alert(
      "Unblock User",
      `Are you sure you want to unblock ${share.user.username}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unblock",
          onPress: () => {
            setShares((prev) =>
              prev.map((s) =>
                s.id === share.id
                  ? { ...s, blocked: false, access_level: "Read" }
                  : s,
              ),
            );
          },
        },
      ],
    );
  }

  return (
    <ScreenWrapper>
      <Text style={styles.headerTitle}>{quiz.title} - Manage Access</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Access level:</Text>
        <TouchableOpacity
          style={styles.accessBadge}
          onPress={handleChangeGlobalAccess}
        >
          <Text style={styles.accessBadgeText}>{accessLevel}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Sharing</Text>
        <View style={styles.sharingBox}>
          <View style={styles.linkContainer}>
            <Text style={styles.linkText} numberOfLines={1}>
              {quiz.link}
            </Text>
            <TouchableOpacity onPress={handleCopyLink}>
              <Feather name="copy" size={18} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="qr-code" size={24} color={COLORS.background} />
          </TouchableOpacity>
        </View>
      </View>

      <Tabs
        activeTab={activeTab}
        onTabChange={(t) => setActiveTab(t)}
        tabs={[
          { id: "users", value: "Users" },
          { id: "blocked", value: "Blocked" },
        ]}
      />

      <View style={styles.listContainer}>
        {activeTab === "users"
          ? activeUsers.map((p) => (
              <ParticipantCard
                key={p.id}
                participant={p}
                handleBlockUser={handleBlockUser}
                handleEditAccess={handleEditAccess}
                handleRemoveUser={handleRemoveUser}
              />
            ))
          : blockedUsers.map((p) => (
              <ParticipantCard
                key={p.id}
                participant={p}
                handleUnblockUser={handleUnblockUser}
              />
            ))}
      </View>

      <QrCodeModal
        visible={modalVisible}
        onHide={setModalVisible}
        link={quiz.link!}
      />
    </ScreenWrapper>
  );
}

export default ManageAccessScreen;

const styles = StyleSheet.create({
  headerTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
  },
  accessBadge: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  accessBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  sharingBox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 16,
  },
  linkContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.input,
    borderWidth: 1,
    borderColor: COLORS.stroke,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 10,
  },
  linkText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  qrButton: {
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    flex: 1,
    paddingTop: 10,
  },
});
