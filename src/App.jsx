import { useEffect, useState } from 'react';
import './styles.css';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [onesignalId, setOneSignalId] = useState(null);

  useEffect(() => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal) {
      await OneSignal.init({
        appId: "fcf28885-6e95-4401-8235-e8223ab2e898",
        serviceWorkerPath: "OneSignalSDKWorker.js",
        serviceWorkerUpdaterPath: "OneSignalSDKUpdaterWorker.js",
        serviceWorkerParam: { scope: "/" },
        autoResubscribe: true,
        autoRegister: false,
      });

      OneSignal.Notifications.addEventListener("permissionPromptDisplay", () => {
        console.log("Permission prompt displayed.");
      });

      OneSignal.Notifications.addEventListener("permissionChange", (granted) => {
        console.log("Permission changed:", granted);
      });

      OneSignal.Notifications.addEventListener("click", (event) => {
        console.log("Notification clicked:", event);
      });

      OneSignal.User.PushSubscription.addEventListener("change", async (event) => {
        if (event.current?.token) {
          console.log("Push token received!");
          const onesignalId = event.current.id;
          console.log("OneSignal ID:", onesignalId);
          setOneSignalId(onesignalId);

          try {
            const response = await fetch(
              "https://go.glideapps.com/api/container/plugin/webhook-trigger/nyEQtv7S4N1E2SfxTuax/80a82896-f99a-40e0-a71c-c35eeb5f11a2",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer fda014a4-0721-45b2-a1d8-4691500ae2da"
                },
                body: JSON.stringify({ onesignalUserId: onesignalId })
              }
            );

            if (!response.ok) {
              const text = await response.text();
              console.error("Failed to send to Glide:", text);
            } else {
              console.log("Sent to Glide");
            }
          } catch (err) {
            console.error("Error sending ID to Glide:", err);
          }
        }
      });

      setIsReady(true);
    });
  }, []);

  return (
    <div className="App">
      <h1>▚ OneSignal Terminal ▞</h1>
      <div className="status-box">
        {onesignalId ? (
          <>
            <p className="label">✅ OneSignal ID</p>
            <p className="id">{onesignalId}</p>
          </>
        ) : (
          <p className="waiting">⌛ Waiting for push permission...</p>
        )}
      </div>
    </div>
  );
}

export default App;
