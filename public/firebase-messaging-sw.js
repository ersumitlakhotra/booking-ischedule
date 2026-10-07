/* public/firebase-messaging-sw.js */
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDx581IKJuvCfrUxPOYpylKqpW6_N7onII",
    authDomain: "ischedule-5112e.firebaseapp.com",
    projectId: "ischedule-5112e",
    storageBucket: "ischedule-5112e.firebasestorage.app",
    messagingSenderId: "169235267382",
    appId: "1:169235267382:web:acd314f9517b044ce53d97",
    measurementId: "G-WGGKY87GMZ"
});


const messaging = firebase.messaging();


messaging.onBackgroundMessage(async  function (payload) {
  console.log("Received background message: ", payload);
  self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then((clients) => {
      for (const client of clients) {
        client.postMessage({
          type: 'DATA_REFRESH',
          entity: payload.data.entity // optional
        });
      }
    });
    
  self.registration.showNotification(payload.data.title, {
    body: payload.data.body,
    icon: "/icon192.png", 
    tag: 'updates',             
    renotify: true,
    requireInteraction: true
  });
});
