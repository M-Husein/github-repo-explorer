import { NotificationProvider } from "@refinedev/core";
import { App, notification as staticNotification } from "antd";
import { UndoableNotification } from "@/components/UndoableNotification";

export const useNotificationProvider = (): NotificationProvider => {
  const { notification: notificationFromContext } = App.useApp();
  const notification = "open" in notificationFromContext ? notificationFromContext : staticNotification;

  const notificationProvider: NotificationProvider = {
    open: ({
      key,
      message,
      description,
      type,
      cancelMutation,
      undoableTimeout,
      // CUSTOM
      placement = "bottomLeft",
      duration = 5,
      ...etc
    }: any) => {
      // Don't show notification if request abort / cancel
      if (description === 'AbortError' || description?.includes('aborted')) {
        return;
      }
      
      if (type === "progress") {
        notification.open({
          key,
          description: (
            <UndoableNotification
              notificationKey={key}
              message={message}
              cancelMutation={() => {
                cancelMutation?.();
                notification.destroy(key ?? "");
              }}
              undoableTimeout={undoableTimeout}
            />
          ),
          message: null,
          duration: 0,
          closeIcon: <></>,
          placement,
        });
      }
      else {
        notification.open({
          key,
          // description: message,
          /** @DEV : Find other solution */
          description: typeof message === 'string' ? message.split('&#x2F;')[0].replaceAll('-', ' ') : message,
          message: description ?? null,
          type,
          /** @CUSTOM */
          duration,
          placement,
          ...etc
        });
      }
    },
    close: (key: any) => notification.destroy(key),
  };

  return notificationProvider;
}
