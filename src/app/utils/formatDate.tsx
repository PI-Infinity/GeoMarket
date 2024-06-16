// format order date to display format
export const FormatDate = (dateValue: any) => {
  const date = new Date(dateValue);

  // Example format: "February 25, 2024, 16:35"
  // Adjust the format according to your needs
  const formattedDate = date.toLocaleString("en-US", {
    month: "short", // "February"
    day: "2-digit", // "25"
    year: "numeric", // "2024"
    hour: "2-digit", // "16"
    minute: "2-digit", // "35"
    hour12: false,
  });
  return formattedDate;
};
