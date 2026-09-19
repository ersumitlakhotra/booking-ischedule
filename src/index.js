import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/*if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
   navigator.serviceWorker.register("/firebase-messaging-sw.js")
      .then(registration =>initNotification(registration))
      //.catch(console.error);
  });
}
  */
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

//https://flowbite.com/application-ui/preview/
//https://flowbite.com/docs/components/tables/
reportWebVitals();

