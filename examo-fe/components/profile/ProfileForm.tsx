import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Controller, Control } from "react-hook-form";
import COLORS from "@/constants/colors";
import { ProfileFormData } from "@/types/ProfileFormData";

type ProfileFormProps = {
  control: Control<ProfileFormData>;
};

export default function ProfileForm({ control }: ProfileFormProps) {
  return (
    <>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Username</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter your Username"
              placeholderTextColor={COLORS.textSecondary}
            />
          )}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter your Name"
              placeholderTextColor={COLORS.textSecondary}
            />
          )}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Surname</Text>
        <Controller
          control={control}
          name="surname"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter your Surname"
              placeholderTextColor={COLORS.textSecondary}
            />
          )}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your Email"
              placeholderTextColor={COLORS.textSecondary}
            />
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
});
