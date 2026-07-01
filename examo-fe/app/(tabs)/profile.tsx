import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useForm } from "react-hook-form";
import COLORS from "@/constants/colors";
import Fab from "@/components/ui/Fab";
import ProfileForm from "@/components/profile/ProfileForm";
import { ProfileFormData } from "@/types/ProfileFormData";
import { USER } from "@/constants/mocks";
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ProfileHeader from "@/components/layout/ProfileHeader";

function ProfileScreen() {
  const { control, handleSubmit } = useForm<ProfileFormData>({
    defaultValues: {
      username: USER.username,
      name: USER.name,
      surname: USER.surname,
      email: USER.email,
    },
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log("Saved Profile Data:", data);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenWrapper>
        <ProfileHeader />
        <ScrollView contentContainerStyle={styles.container}>
          <ProfileForm control={control} />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              activeOpacity={0.8}
            >
              <Text style={styles.dangerButtonText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenWrapper>

      <Fab
        icon="save-outline"
        backgroundColor={COLORS.success}
        iconColor={COLORS.text}
        onPress={handleSubmit(onSubmit)}
      />
    </KeyboardAvoidingView>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.input,
    color: COLORS.text,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.stroke || "transparent",
  },
  buttonsContainer: {
    marginTop: 32,
    alignItems: "center",
    gap: 16,
  },
  actionButton: {
    width: "80%",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
  },
  dangerButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});
