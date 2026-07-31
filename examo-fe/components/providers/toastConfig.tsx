import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";
import COLORS from "@/constants/colors";

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: COLORS.success,
        backgroundColor: COLORS.surface,
        height: "auto",
        minHeight: 65,
        paddingVertical: 12,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 15, fontWeight: "bold", color: COLORS.text }}
      text2Style={{ fontSize: 13, color: COLORS.textSecondary }}
      text2NumberOfLines={2}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: COLORS.danger,
        backgroundColor: COLORS.surface,
        height: "auto",
        minHeight: 65,
        paddingVertical: 12,
      }}
      text1Style={{ fontSize: 15, fontWeight: "bold", color: COLORS.text }}
      text2Style={{ fontSize: 13, color: COLORS.textSecondary }}
      text2NumberOfLines={3}
    />
  ),
};
