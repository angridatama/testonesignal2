import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import OneSignal from 'onesignal-cordova-plugin';

// Mount React
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Init OneSignal
OneSignal.initialize({
  appId: "fcf28885-6e95-4401-8235-e8223ab2e898", // Replace with your real App ID
  notifyButton: {
    enable: true,
  },
  allowLocalhostAsSecureOrigin: true, // Only needed for local dev
}).then(() => {
  // Optionally set email/tag from query params
  const queryParams = new URLSearchParams(window.location.search);
  const email = queryParams.get("email");

  if (email) {
    OneSignal.setEmail(email);
    OneSignal.sendTag("user_email", email);
  }
});
