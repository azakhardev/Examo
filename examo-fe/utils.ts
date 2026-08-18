import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

function formatTimeLeft(endTimeString: string): string {
  const total = Date.parse(endTimeString) - Date.now();
  if (total <= 0) return "00:00:00";

  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const seconds = Math.floor((total / 1000) % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function formatDateTime(dateObj: Date) {
  const formattedDate = `${dateObj.getDate().toString().padStart(2, "0")}.${(
    dateObj.getMonth() + 1
  )
    .toString()
    .padStart(
      2,
      "0",
    )}.${dateObj.getFullYear()} ${dateObj.getHours().toString().padStart(2, "0")}:${dateObj.getMinutes().toString().padStart(2, "0")}`;

  return formattedDate;
}

function formatDuration(minutes?: number) {
  const formattedDuration = minutes
    ? `${Math.floor(minutes / 60)}h ${minutes % 60}min`
    : "0h 00min";
  return formattedDuration;
}

function formatEnum(value: string, separator?: string) {
  return value
    .split("_")
    .reduce((prev, current) => `${prev}${separator ?? " "}${current}`);
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },

  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async removeItem(key: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export {
  formatTimeLeft,
  formatDateTime,
  formatDuration,
  formatEnum,
  formatTime,
  storage,
};
