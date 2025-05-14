import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Wait for OneSignal SDK to load from the CDN
function waitForOneSignal(timeout = 10000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      if (window.OneSignal && Array.isArray(window.OneSignal)) {
        resolve(window.OneSignal);
      } else if (Date.now() - start > timeout) {
        reject(new Error("OneSignal SDK failed to load"));
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
}

waitForOneSignal()
  .then((OneSignal) => {
    OneSignal.push(() => {
      try {
        OneSignal.init({
          appId: 'YOUR-ONESIGNAL-APP-ID', // Replace with your actual App ID
          notifyButton: {
            enable: true,
          },
          allowLocalhostAsSecureOrigin: true, // For local development
        });

        console.log("OneSignal initialized");

        const queryParams = new URLSearchParams(window.location.search);
        const email = queryParams.get("email");

        if (email) {
          OneSignal.setEmail(email).catch(err => {
            console.warn("Failed to set email:", err);
          });

          OneSignal.sendTag("user_email", email).catch(err => {
            console.warn("Failed to send tag:", err);
          });
        }
      } catch (err) {
        console.error("Error during OneSignal.init():", err);
      }
    });
  })
  .catch((err) => {
    console.error("OneSignal SDK not available:", err);
  });
