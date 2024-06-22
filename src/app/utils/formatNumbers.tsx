export const formatNumbers = (numbers: any) => {
  if (!numbers) return 0;
  if (numbers < 1000) return numbers;
  if (numbers < 10000) return `${(numbers / 1000).toFixed(0)}k`;
  if (numbers < 1000000) return `${Math.floor(numbers / 1000)}k`;
  return `${(numbers / 1000000).toFixed(1)}m`;
};
