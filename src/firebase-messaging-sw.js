importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
// importScripts('/__/firebase/init.js');

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.
firebase.initializeApp({
  'messagingSenderId': '806581471793'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  //console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = payload.notification.title;
  var notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.body.icon,
    vibrate: [200,100,200],
    badge: 'https://silvesterplanung-47c2f.firebaseapp.com/assets/pictures/middlefinger.png',
    data: "https://silvesterplanung-47c2f.firebaseapp.com/prices",
    click_action: "/prices"
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  clients.openWindow("https://silvesterplanung-47c2f.firebaseapp.com/prices");
},false);
