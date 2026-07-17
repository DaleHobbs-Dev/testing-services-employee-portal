import { deleteJson, fetchJson, patchJson, postJson, putJson } from "./apiSettings";

const toQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

const toNumberOrValue = (value) => {
  if (value === undefined || value === null || value === "") return value;

  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? value : numberValue;
};

const normalizeNumberArray = (values = []) => values.map(toNumberOrValue);

const normalizeClosurePayload = (closureData = {}) => ({
  ...closureData,
  locationId: toNumberOrValue(closureData.locationId),
  holidayId: toNumberOrValue(closureData.holidayId),
});

const normalizeTestFamilyBadgePayload = (badgeData = {}) => ({
  ...badgeData,
  testFamilyId: toNumberOrValue(badgeData.testFamilyId),
  locationId: toNumberOrValue(badgeData.locationId),
  locationIds: normalizeNumberArray(badgeData.locationIds),
});

const normalizeEmployeeBadgePayload = (badgeData = {}) => ({
  ...badgeData,
  employeeId: toNumberOrValue(badgeData.employeeId),
  locationId: toNumberOrValue(badgeData.locationId),
  locationIds: normalizeNumberArray(badgeData.locationIds),
});

const normalizeDayNotePayload = (noteData = {}) => ({
  ...noteData,
  locationId: toNumberOrValue(noteData.locationId),
});

const normalizeCalendarPayload = (calendarData = {}) => ({
  ...calendarData,
  year: toNumberOrValue(calendarData.year),
  startMonth: toNumberOrValue(calendarData.startMonth),
  endMonth: toNumberOrValue(calendarData.endMonth),
  employeeId: toNumberOrValue(calendarData.employeeId),
});

const toDateOnly = (value) => {
  if (!value) return value;
  return String(value).slice(0, 10);
};

const toTimeOnly = (value) => {
  if (!value) return value;

  const rawValue = String(value);
  const timeMatch = rawValue.match(/T(\d{2}:\d{2})/);

  if (timeMatch) return timeMatch[1];

  return rawValue.slice(0, 5);
};

const normalizeCalendarDayItem = (item = {}) => ({
  ...item,
  date: toDateOnly(item.date),
});

const normalizeBadge = (badge = {}) => ({
  ...normalizeCalendarDayItem(badge),
  startTime: toTimeOnly(badge.startTime),
  endTime: toTimeOnly(badge.endTime),
});

const normalizeDayNote = (note = {}) => ({
  ...normalizeCalendarDayItem(note),
  colorHex: note.colorHex || note.color,
});

const normalizeCalendarList = (response) => {
  if (Array.isArray(response)) return response;
  return response?.calendars || response?.items || [];
};

const normalizeCalendar = (response) => response?.calendar || response;

const normalizeMonthView = (response) => {
  const calendar = response?.calendar || response || {};

  return {
    ...response,
    calendar,
    days: calendar.days || response?.days || [],
    closures: (calendar.closures || response?.closures || []).map(
      normalizeCalendarDayItem
    ),
    labels: (calendar.dayLabels || response?.labels || []).map(
      normalizeCalendarDayItem
    ),
    testFamilyBadges: (
      calendar.testFamilyBadges ||
      response?.testFamilyBadges ||
      []
    ).map(normalizeBadge),
    employeeBadges: (
      calendar.employeeBadges ||
      response?.employeeBadges ||
      []
    ).map(normalizeBadge),
    notes: (calendar.dayNotes || response?.notes || []).map(normalizeDayNote),
  };
};

export const getMyCalendars = async () => {
  return fetchJson("/calendars/mine", { cache: "no-store" }).then(
    normalizeCalendarList
  );
};

export const getAllCalendars = async (params = {}) => {
  return fetchJson(`/calendars${toQueryString(params)}`, {
    cache: "no-store",
  }).then(normalizeCalendarList);
};

export const createCalendar = async (calendarData) => {
  return postJson("/calendars", normalizeCalendarPayload(calendarData)).then(
    normalizeCalendar
  );
};

export const deleteCalendar = async (calendarId) => {
  return deleteJson(`/calendars/${calendarId}`);
};

export const getCalendarMonthView = async (calendarId, params = {}) => {
  const response = await fetchJson(
    `/calendars/${calendarId}/month-view${toQueryString(params)}`,
    { cache: "no-store" }
  );

  return normalizeMonthView(response);
};

export const createCalendarClosure = async (calendarId, closureData) => {
  return postJson(
    `/calendars/${calendarId}/closures`,
    normalizeClosurePayload(closureData)
  );
};

export const deleteCalendarClosure = async (calendarId, closureId) => {
  return deleteJson(`/calendars/${calendarId}/closures/${closureId}`);
};

export const upsertCalendarDayLabel = async (
  calendarId,
  date,
  locationId,
  labelData
) => {
  return putJson(
    `/calendars/${calendarId}/days/${date}/locations/${locationId}/label`,
    labelData
  );
};

export const deleteCalendarDayLabel = async (calendarId, date, locationId) => {
  return deleteJson(
    `/calendars/${calendarId}/days/${date}/locations/${locationId}/label`
  );
};

export const createCalendarTestFamilyBadge = async (calendarId, badgeData) => {
  return postJson(
    `/calendars/${calendarId}/test-family-badges`,
    normalizeTestFamilyBadgePayload(badgeData)
  );
};

export const createBulkCalendarTestFamilyBadges = async (
  calendarId,
  badgeData
) => {
  return postJson(
    `/calendars/${calendarId}/test-family-badges/bulk`,
    normalizeTestFamilyBadgePayload(badgeData)
  );
};

export const deleteCalendarTestFamilyBadge = async (calendarId, badgeId) => {
  return deleteJson(`/calendars/${calendarId}/test-family-badges/${badgeId}`);
};

export const createCalendarEmployeeBadge = async (calendarId, badgeData) => {
  return postJson(
    `/calendars/${calendarId}/employee-badges`,
    normalizeEmployeeBadgePayload(badgeData)
  );
};

export const createBulkCalendarEmployeeBadges = async (
  calendarId,
  badgeData
) => {
  return postJson(
    `/calendars/${calendarId}/employee-badges/bulk`,
    normalizeEmployeeBadgePayload(badgeData)
  );
};

export const updateCalendarEmployeeBadge = async (
  calendarId,
  badgeId,
  badgeData
) => {
  return patchJson(
    `/calendars/${calendarId}/employee-badges/${badgeId}`,
    normalizeEmployeeBadgePayload(badgeData)
  );
};

export const deleteCalendarEmployeeBadge = async (calendarId, badgeId) => {
  return deleteJson(`/calendars/${calendarId}/employee-badges/${badgeId}`);
};

export const createCalendarDayNote = async (calendarId, noteData) => {
  return postJson(
    `/calendars/${calendarId}/day-notes`,
    normalizeDayNotePayload(noteData)
  );
};

export const updateCalendarDayNote = async (calendarId, noteId, noteData) => {
  return patchJson(
    `/calendars/${calendarId}/day-notes/${noteId}`,
    normalizeDayNotePayload(noteData)
  );
};

export const deleteCalendarDayNote = async (calendarId, noteId) => {
  return deleteJson(`/calendars/${calendarId}/day-notes/${noteId}`);
};
