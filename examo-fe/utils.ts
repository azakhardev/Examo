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

export { formatTimeLeft };
