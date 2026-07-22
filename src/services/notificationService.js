import {
  deleteJson,
  fetchJson,
  patchJson,
  postJson,
} from "./apiSettings";

const unwrapNotifications = (response) =>
  Array.isArray(response) ? response : response?.notifications || [];

const unwrapNotification = (response) => response?.notification || response;

export const getAllNotifications = () =>
  fetchJson("/notifications", { cache: "no-store" }).then(unwrapNotifications);

export const getMyNotifications = () =>
  fetchJson("/notifications/mine", { cache: "no-store" }).then(
    unwrapNotifications
  );

export const createNotification = (notification) =>
  postJson("/notifications", notification).then(unwrapNotification);

export const updateNotification = (notificationId, notification) =>
  patchJson(`/notifications/${notificationId}`, notification).then(
    unwrapNotification
  );

export const deleteNotification = (notificationId) =>
  deleteJson(`/notifications/${notificationId}`);

export const dismissNotification = (notificationId) =>
  postJson(`/notifications/${notificationId}/dismiss`, {});
