const timeToMinutes = (time) => {
  if (!time) return 0;
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

export const getBadgeHours = (badge) => {
  if (!badge?.startTime || !badge?.endTime || badge.customLabel) return 0;

  const minutes = timeToMinutes(badge.endTime) - timeToMinutes(badge.startTime);
  return Math.max(minutes, 0) / 60;
};

export const sumEmployeeBadgeHours = (badges = []) =>
  badges.reduce((total, badge) => total + getBadgeHours(badge), 0);
