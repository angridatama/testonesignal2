import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

window.addEventListener('load', () => {
  const waitForOneSignal = (timeout = 10000) => {
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
  };

  waitForOneSignal()
    .then((OneSignal) => {
      OneSignal.push(() => {
        try {
          OneSignal.init({
            appId: 'fcf28885-6e95-4401-8235-e8223ab2e898', // replace this!
            notifyButton: {
              enable: true,
            },
            allowLocalhostAsSecureOrigin: true,
          });

          console.log("✅ OneSignal initialized");

          const queryParams = new URLSearchParams(window.location.search);
          const email = queryParams.get("email");

          if (email) {
            OneSignal.setEmail(email).catch(err =>
              console.warn("❌ Failed to set email:", err)
            );
            OneSignal.sendTag("user_email", email).catch(err =>
              console.warn("❌ Failed to send tag:", err)
            );
          }
        } catch (err) {
          console.error("❌ Error in OneSignal.push/init:", err);
        }
      });
    })
    .catch((err) => {
      console.error("❌ OneSignal SDK not available:", err);
    });
});
