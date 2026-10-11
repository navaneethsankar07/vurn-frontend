import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import api from "@/api/axios";

export const enablePushNotifications = async (): Promise<string> => {
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    throw new Error("Browser push notifications are not supported.");
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    throw new Error("Firebase messaging is not supported in this browser.");
  }

  const registration = await navigator.serviceWorker.register(
    "/firebase-messaging-sw.js",
  );

  const token = await getToken(messaging, {
    vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    throw new Error("Unable to obtain an FCM registration token.");
  }

  await api.post("/notifications/devices/register/", { token });

  return token;
};

export const disablePushNotifications = async (
  token: string,
): Promise<void> => {
  if (!token) return;
  try {
    await api.delete("/notifications/devices/unregister/", {
      data: { token },
    });
  } catch (error) {
    console.error("Failed to unregister device token from backend:", error);
    throw error;
  }
};

export const listenForForegroundMessages = async (
  onNotification: (payload: unknown) => void,
) => {
  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    onNotification(payload);
  });
};
