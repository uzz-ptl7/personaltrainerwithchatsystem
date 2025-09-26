importScripts(
  "https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyAQKLC8CdOobgZsDfNxe2SHuL-WmZHGl4M",
  authDomain: "ptcsystem-c7a07.firebaseapp.com",
  projectId: "ptcsystem-c7a07",
  storageBucket: "ptcsystem-c7a07.appspot.com",
  messagingSenderId: "184544207619",
  appId: "1:184544207619:web:80b74e5067f3158abcff36",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "New Message";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: "chat-message",
    renotify: true,
    requireInteraction: true,
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("/"));
});
