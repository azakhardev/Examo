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
    .padStart(2, "0")}.${dateObj.getFullYear()}`;

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

export { formatTimeLeft, formatDateTime, formatDuration, formatEnum };
