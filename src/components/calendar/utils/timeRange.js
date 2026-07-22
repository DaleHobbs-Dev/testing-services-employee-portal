export const formatOptionalTimeRange = (startTime, endTime) => {
  if (!startTime) return "";
  return endTime ? `${startTime}-${endTime}` : startTime;
};
