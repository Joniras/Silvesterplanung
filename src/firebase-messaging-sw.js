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
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  var notificationTitle = payload.data.title;
  var notificationOptions = {
    body: payload.data.body,
    icon: payload.data.icon,
    vibrate: [200,100,200],
    badge: 'https://silvesterplanung-47c2f.firebaseapp.com/assets/pictures/middlefinger.png',
    data: "https://silvesterplanung-47c2f.firebaseapp.com/prices",
    click_action: "https://silvesterplanung-47c2f.firebaseapp.com/prices"
  };
  self.console.log("In here 1",notificationOptions);
  self.registration.showNotification(notificationTitle,
    notificationOptions);
});


self.addEventListener("notificationclick", (event) => {
  event.waitUntil(async function () {
    const allClients = await clients.matchAll({
      includeUncontrolled: true
    });
    let chatClient;
    let appUrl = '/';
    for (const client of allClients) {
      //here appUrl is the application url, we are checking it application tab is open
      if(client['url'].indexOf(appUrl) >= 0)
      {
        client.focus();
        chatClient = client;
        break;
      }
    }
    if (!chatClient) {
      chatClient = await clients.openWindow(appUrl);
    }
  }());
});
