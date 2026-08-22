import api from "@/api/api";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";

export async function downloadQuizFile(uuid: string) {
  try {
    const response = await api.get(`/quizzes/${uuid}/download`);
    const content = JSON.stringify(response.data, null, 2);

    // Extract filename from Content-Disposition header if available
    const disposition = response.headers["content-disposition"];
    let filename = `quiz_${uuid}.json`;
    if (disposition && disposition.includes("filename=")) {
      filename = disposition.split("filename=")[1].replace(/["']/g, "");
    }

    if (Platform.OS === "web") {
      // WEB: Trigger browser anchor download via Blob
      const blob = new Blob([content], { type: "application/json" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      // NATIVE MOBILE: Modern expo-file-system File & Paths API
      const file = new File(Paths.document, filename);

      if (!file.exists) {
        file.create();
      }
      file.write(content);

      Toast.show({
        type: "success",
        text1: "Download Complete",
        text2: `Saved to documents: ${filename}`,
      });

      // Open native mobile share sheet to save/export the file
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(file.uri, {
          mimeType: "application/json",
          dialogTitle: "Export Quiz JSON",
          UTI: "public.json",
        });
      }
    }
  } catch (error) {
    Toast.show({
      type: "error",
      text1: "Download Failed",
      text2: "Could not download the quiz file.",
    });
  }
}
