import React, { useEffect } from "react";
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
import ScreenWrapper from "@/components/layout/ScreenWrapper";
import ProfileHeader from "@/components/layout/ProfileHeader";
import useGetProfileInfo from "@/api/users/useGetProfileInfo";
import useUpdateProfileInfo from "@/api/users/useUpdateProfileInfo";
import Loader from "@/components/ui/Loader";
import ErrorView from "@/components/ui/ErrorView";
import { queryClient } from "@/components/providers/QueryProvider";
import { queryKeys } from "@/api/queryKeys";
import Toast from "react-native-toast-message";

function ProfileScreen() {
  const { data, isLoading, isError, error, refetch } = useGetProfileInfo();
  const { mutateAsync, isPending } = useUpdateProfileInfo();

  const { control, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues: {
      username: data?.username,
      name: data?.name,
      surname: data?.surname,
      email: data?.email,
    },
  });

  useEffect(() => {
    if (data) {
      reset({
        username: data.username,
        name: data.name,
        surname: data.surname,
        email: data.email,
      });
    }
  }, [data, reset]);

  async function onSubmit(data: ProfileFormData) {
    mutateAsync(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.profile });
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Profile updated successfully!",
        });
      },
      onError: (e) => {
        Toast.show({
          type: "error",
          text1: "Update failed",
          text2: e.message || "Something went wrong",
        });
      },
    });
  }

  if (isError) {
    return <ErrorView error={error} onRetry={refetch} />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScreenWrapper>
        <ProfileHeader />
        {isLoading ? (
          <Loader />
        ) : (
          <ScrollView contentContainerStyle={styles.container}>
            <ProfileForm control={control} />
            {/* TODO: Create EP for buttons */}
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
        )}
      </ScreenWrapper>

      <Fab
        icon="save-outline"
        backgroundColor={COLORS.success}
        iconColor={COLORS.text}
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
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
