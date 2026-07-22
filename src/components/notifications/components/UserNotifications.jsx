import { useEffect, useState } from "react";
import { BellAlertIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Alert, Button, Spinner } from "@/components";
import { dismissNotification, getMyNotifications } from "@/services";

const categoryVariants = {
  SECURITY: "warning",
  REMOVED: "warning",
  DEPRECATED: "warning",
  FIXED: "success",
  ADDED: "info",
  CHANGED: "info",
};

export function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [dismissErrors, setDismissErrors] = useState({});
  const [dismissingIds, setDismissingIds] = useState([]);

  useEffect(() => {
    let active = true;

    getMyNotifications()
      .then((data) => {
        if (active) setNotifications(data);
      })
      .catch((error) => {
        console.error("Failed to load release notifications:", error);
        if (active) {
          setLoadError("Release notifications could not be loaded.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleDismiss = async (notificationId) => {
    setDismissingIds((ids) => [...ids, notificationId]);
    setDismissErrors((errors) => ({ ...errors, [notificationId]: "" }));

    try {
      await dismissNotification(notificationId);
      setNotifications((items) =>
        items.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("Failed to dismiss release notification:", error);
      setDismissErrors((errors) => ({
        ...errors,
        [notificationId]: "Could not dismiss this notification. Try again.",
      }));
    } finally {
      setDismissingIds((ids) => ids.filter((id) => id !== notificationId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-3 text-sm text-adaptive-muted">
        <Spinner size="sm" />
        <span>Loading release notifications...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <Alert variant="error" className="mb-6" role="alert">
        {loadError}
      </Alert>
    );
  }

  if (notifications.length === 0) return null;

  return (
    <section aria-labelledby="release-notifications-heading" className="mb-6 space-y-3">
      <h2 id="release-notifications-heading" className="sr-only">
        Release notifications
      </h2>

      {notifications.map((notification) => {
        const isDismissing = dismissingIds.includes(notification.id);

        return (
          <Alert
            key={notification.id}
            variant={categoryVariants[notification.category] || "info"}
            role="status"
          >
            <div className="flex items-start gap-3">
              <BellAlertIcon className="mt-0.5 h-6 w-6 shrink-0" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="font-semibold">{notification.title}</h3>
                  {notification.version && (
                    <span className="text-xs font-medium">
                      Version {notification.version}
                    </span>
                  )}
                </div>
                <p className="mt-1 whitespace-pre-wrap">{notification.message}</p>
                {dismissErrors[notification.id] && (
                  <p className="mt-2 text-sm font-medium" role="alert">
                    {dismissErrors[notification.id]}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                className="shrink-0 p-1"
                onClick={() => handleDismiss(notification.id)}
                disabled={isDismissing}
                aria-label={`Dismiss ${notification.title}`}
                title="Dismiss notification"
              >
                {isDismissing ? <Spinner size="sm" /> : <XMarkIcon className="h-5 w-5" />}
              </Button>
            </div>
          </Alert>
        );
      })}
    </section>
  );
}
