// Files: public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

// Support dynamic config from query parameters or fallback to default config
const params = new URLSearchParams(self.location.search);
const firebaseConfig = {
  apiKey: params.get("apiKey") || "AIzaSyDKtS87Ch3UYZ9NZsIWzInfiK5iIUn6tDw",
  authDomain: params.get("authDomain") || "next-moodle.firebaseapp.com",
  projectId: params.get("projectId") || "next-moodle",
  storageBucket:
    params.get("storageBucket") || "next-moodle.firebasestorage.app",
  messagingSenderId: params.get("messagingSenderId") || "691159494660",
  appId: params.get("appId") || "1:691159494660:web:31ec7c8b041125bc2f4551",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  // If payload contains 'notification', FCM SDK automatically displays it in background on web.
  // Calling showNotification again causes a duplicate notification.
  if (payload.notification) {
    return;
  }

  const notificationTitle = payload.data?.title || "Notifikasi Baru";
  const notificationId =
    payload.data?.id || payload.data?.notificationId || "default";
  const linkPath = payload.data?.linkPath || payload.data?.url || "/";

  const notificationOptions = {
    body: payload.data?.body || "",
    icon: "/favicon.ico",
    tag: notificationId, // Deduplication tag prevents multiple notifications for same ID
    data: {
      id: notificationId,
      linkPath: linkPath,
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click with path validation
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const rawPath = event.notification.data?.linkPath || "/";
  // Validate path to prevent open redirect or invalid schemes: only allow relative paths starting with '/'
  const targetPath =
    typeof rawPath === "string" &&
    rawPath.startsWith("/") &&
    !rawPath.startsWith("//")
      ? rawPath
      : "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If a window is already open, focus it and navigate
        for (const client of clientList) {
          if ("focus" in client) {
            if ("navigate" in client) {
              client.navigate(targetPath);
            }
            return client.focus();
          }
        }
        // Otherwise open a new window
        if (clients.openWindow) {
          return clients.openWindow(targetPath);
        }
      }),
  );
});
