import { getToken, onMessage } from "firebase/messaging";
import { getFirebaseMessaging } from "@/lib/firebase";
import api from "@/api/axios";

export const enablePushNotifications = async (): Promise<string> => {
  if (
    !("Notification" in window) ||
    !("serviceWorker" in navigator) ||
    !window.isSecureContext
  ) {
    throw new Error(
      "Push notifications require a supported browser and a secure context.",
    );
  }

  if (Notification.permission === "denied") {
    throw new Error(
      "Notifications are blocked. Allow them in your browser site settings.",
    );
  }

  const permission =
    Notification.permission === "granted"
      ? "granted"
      : await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    throw new Error("Firebase messaging is not supported in this browser.");
  }

  const params = new URLSearchParams({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  });

  const registration = await navigator.serviceWorker.register(
    `/firebase-messaging-sw.js?${params.toString()}`,
    { scope: "/" },
  );

  await navigator.serviceWorker.ready;

  if (!registration.active) {
    throw new Error(
      "The push notification service worker is not active yet. Please try again.",
    );
  }

  const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

  if (!vapidKey) {
    throw new Error("Firebase VAPID key is missing from the environment.");
  }

  const token = await getToken(messaging, {
    vapidKey,
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
  onNotification?: (payload: unknown) => void,
) => {
  const messaging = await getFirebaseMessaging();

  if (!messaging) {
    return () => {};
  }

  return onMessage(messaging, async (payload) => {
    onNotification?.(payload);

    const title = payload.data?.title || "VURN";
    const body = payload.data?.body || "You have a new notification.";

    if (Notification.permission === "granted") {
        const registration = await navigator.serviceWorker.ready;

        await registration.showNotification(title, {
          body,
          icon: "/favicon.svg",
          data: payload.data || {},
        });

    }
  });
};
