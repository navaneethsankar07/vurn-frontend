importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js",
);

const params = new URL(self.location.href).searchParams;

const firebaseConfig = {
  apiKey: params.get("apiKey"),
  authDomain: params.get("authDomain"),
  projectId: params.get("projectId"),
  storageBucket: params.get("storageBucket"),
  messagingSenderId: params.get("messagingSenderId"),
  appId: params.get("appId"),
};

if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.projectId ||
  !firebaseConfig.messagingSenderId ||
  !firebaseConfig.appId
) {
  throw new Error(
    "Firebase configuration is missing from the service worker URL.",
  );
}

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.data?.title || "VURN";

  return self.registration.showNotification(title, {
    body: payload.data?.body || "You have a new notification.",
    icon: "/favicon.svg",
    data: payload.data || {},
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  event.waitUntil(
    clients.openWindow(new URL(targetUrl, self.location.origin).href),
  );
});
