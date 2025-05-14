import { useEffect } from 'react';

function App() {
  useEffect(() => {
    async function initOneSignalAndSendToGlide() {
      try {
        // Wait until OneSignal is loaded and initialized
        window.OneSignalDeferred = window.OneSignalDeferred || [];
        window.OneSignalDeferred.push(async function (OneSignal) {
          await OneSignal.init({
            appId: "fcf28885-6e95-4401-8235-e8223ab2e898",
            serviceWorkerPath: "OneSignalSDKWorker.js",
            serviceWorkerUpdaterPath: "OneSignalSDKUpdaterWorker.js",
            serviceWorkerParam: { scope: "/" },
            autoResubscribe: true,
          });

          // Request user permission to show notifications
          const permission = await OneSignal.Notifications.requestPermission();
          if (permission !== 'granted') {
            console.warn("Push notification permission not granted:", permission);
            return;
          }

          // Get OneSignal User ID
          const onesignalUserId = await OneSignal.User.getId();
          console.log("OneSignal User ID:", onesignalUserId);

          if (!onesignalUserId) {
            console.error("Failed to retrieve OneSignal User ID.");
            return;
          }

          // Send the User ID to your Glide webhook
          const response = await fetch(
            "https://go.glideapps.com/api/container/plugin/webhook-trigger/nyEQtv7S4N1E2SfxTuax/80a82896-f99a-40e0-a71c-c35eeb5f11a2",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer fda014a4-0721-45b2-a1d8-4691500ae2da",
              },
              body: JSON.stringify({ onesignalUserId }),
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to send to Glide:", errorText);
          } else {
            console.log("Successfully sent OneSignal ID to Glide.");
          }
        });
      } catch (error) {
        console.error("Error initializing OneSignal or sending to Glide:", error);
      }
    }

    initOneSignalAndSendToGlide();
  }, []);

  return (
    <div className="App">
      <h1>OneSignal + Glide Integration</h1>
    </div>
  );
}

export default App;
