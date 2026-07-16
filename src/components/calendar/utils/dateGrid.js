const WEEK_LENGTH = 7;

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const getMonthName = (month) => MONTH_NAMES[month - 1] || "";

export const buildMonthGrid = (year, month) => {
  const firstOfMonth = new Date(year, month - 1, 1);
  const lastOfMonth = new Date(year, month, 0);
  const days = [];

  for (let i = 0; i < firstOfMonth.getDay(); i += 1) {
    days.push({
      key: `leading-${i}`,
      date: null,
      dayNumber: "",
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= lastOfMonth.getDate(); day += 1) {
    const date = new Date(year, month - 1, day);

    days.push({
      key: toDateString(date),
      date: toDateString(date),
      dayNumber: day,
      isCurrentMonth: true,
    });
  }

  while (days.length % WEEK_LENGTH !== 0) {
    days.push({
      key: `trailing-${days.length}`,
      date: null,
      dayNumber: "",
      isCurrentMonth: false,
    });
  }

  const weeks = [];
  for (let index = 0; index < days.length; index += WEEK_LENGTH) {
    weeks.push(days.slice(index, index + WEEK_LENGTH));
  }

  return weeks;
};
