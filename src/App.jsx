import { useEffect, useState } from 'react';

function App() {
  const [isReady, setIsReady] = useState(false);

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

      // Permission prompt display event
      OneSignal.Notifications.addEventListener("permissionPromptDisplay", () => {
        console.log("Permission prompt displayed.");
      });

      // Permission change event
      OneSignal.Notifications.addEventListener("permissionChange", (granted) => {
        console.log("Permission changed:", granted);
      });

      // Notification click event
      OneSignal.Notifications.addEventListener("click", (event) => {
        console.log("Notification clicked:", event);
      });

      // Push subscription change event
      OneSignal.User.PushSubscription.addEventListener("change", async (event) => {
        if (event.current?.token) {
          console.log("Push token received!");

          const onesignalId = event.current.id;
          console.log("OneSignal ID:", onesignalId);

          // Send to Glide
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
              alert("Sent OneSignal ID to Glide!");
            }
          } catch (err) {
            console.error("Error sending ID to Glide:", err);
          }
        }
      });

      setIsReady(true);
    });
  }, []);

  const handlePrompt = async () => {
    try {
      await window.OneSignal.Slidedown.promptPush({ force: true });

      const state = await window.OneSignal.User.PushSubscription.get();
      console.log("Push subscription state:", state);

      if (!state.optedIn) {
        alert("You need to allow notifications to continue.");
      }
    } catch (err) {
      console.error("Prompt error:", err);
    }
  };

  return (
    <div className="App">
      <h1>OneSignal + Glide Integration</h1>
    </div>
  );
}

export default App;
