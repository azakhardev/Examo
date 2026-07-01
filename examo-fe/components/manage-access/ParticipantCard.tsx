import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import COLORS from "@/constants/colors";
import { QuizParticipant } from "@/types/QuizParticipant";

type ParticipantCardProps = {
  participant: QuizParticipant;
  handleEditAccess?: (participant: QuizParticipant) => void;
  handleBlockUser?: (participant: QuizParticipant) => void;
  handleRemoveUser?: (participant: QuizParticipant) => void;
  handleUnblockUser?: (participant: QuizParticipant) => void;
};

function ParticipantCard({
  participant,
  handleBlockUser,
  handleEditAccess,
  handleRemoveUser,
  handleUnblockUser,
}: ParticipantCardProps) {
  return (
    <View key={participant.id} style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{participant.user.username}</Text>
        <Text style={styles.userAccess}>
          Access: {participant.access_level}
        </Text>
      </View>
      <View style={styles.actions}>
        {handleEditAccess && (
          <TouchableOpacity
            onPress={() => handleEditAccess(participant)}
            style={styles.iconBtn}
          >
            <MaterialIcons name="edit" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        {handleBlockUser && (
          <TouchableOpacity
            onPress={() => handleBlockUser(participant)}
            style={styles.iconBtn}
          >
            <MaterialIcons name="block" size={20} color={COLORS.danger} />
          </TouchableOpacity>
        )}

        {handleRemoveUser && (
          <TouchableOpacity
            onPress={() => handleRemoveUser(participant)}
            style={styles.iconBtn}
          >
            <Ionicons name="close" size={24} color={COLORS.danger} />
          </TouchableOpacity>
        )}

        {handleUnblockUser && (
          <TouchableOpacity
            onPress={() => handleUnblockUser(participant)}
            style={styles.iconBtn}
          >
            <MaterialIcons
              name="person-add-alt-1"
              size={22}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default ParticipantCard;

const styles = StyleSheet.create({
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    justifyContent: "space-between",
    borderColor: COLORS.stroke,
    borderWidth: 1,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  userAccess: {
    color: COLORS.textSecondary,
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    marginLeft: 16,
  },
});
