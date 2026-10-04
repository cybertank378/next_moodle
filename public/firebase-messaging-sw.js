importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
const firebaseConfig = {
  apiKey: "AIzaSyDKtS87Ch3UYZ9NZsIWzInfiK5iIUn6tDw",
  authDomain: "next-moodle.firebaseapp.com",
  projectId: "next-moodle",
  storageBucket: "next-moodle.firebasestorage.app",
  messagingSenderId: "691159494660",
  appId: "1:691159494660:web:31ec7c8b041125bc2f4551",
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  
  const notificationTitle = payload.data?.title || payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.data?.body || payload.notification?.body,
    icon: "/favicon.ico",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
