import { useEffect, useState } from 'react';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (window.OneSignal) {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function (OneSignal) {
        await OneSignal.init({
          appId: "fcf28885-6e95-4401-8235-e8223ab2e898",
          serviceWorkerPath: "OneSignalSDKWorker.js",
          serviceWorkerUpdaterPath: "OneSignalSDKUpdaterWorker.js",
          serviceWorkerParam: { scope: "/" },
          autoResubscribe: true,
          autoRegister: false, // You control when to prompt
        });

        // Event: permission prompt is displayed
        OneSignal.Notifications.addEventListener("permissionPromptDisplay", () => {
          console.log("Permission prompt displayed.");
        });

        // Event: permission changed (allow/block/dismiss)
        OneSignal.Notifications.addEventListener("permissionChange", (permission) => {
          console.log(`Permission changed: ${permission ? "granted" : "denied"}`);
        });

        // Event: notification clicked
        OneSignal.Notifications.addEventListener("click", (event) => {
          console.log("Notification click event:", event);
        });

        setIsReady(true);
      });
    }
  }, []);

  const handlePrompt = async () => {
    try {
      // Show the OneSignal slidedown prompt with force (UI-bound click)
      await window.OneSignal.Slidedown.promptPush({ force: true });

      // Wait a moment for permission to settle
      const permission = await window.OneSignal.Notifications.permission;

      console.log("Notification permission status:", permission);

      if (permission !== 'granted') {
        alert("Permission not granted. Please allow notifications.");
        return;
      }

      const onesignalId = await window.OneSignal.User.onesignalId;
      console.log("OneSignal ID:", onesignalId);

      if (!onesignalId) {
        console.error("Failed to retrieve OneSignal ID.");
        return;
      }

      // Send ID to Glide
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
        const errorText = await response.text();
        console.error("Error sending to Glide:", errorText);
      } else {
        alert("Successfully sent OneSignal ID to Glide!");
      }
    } catch (error) {
      console.error("Unexpected error during prompt:", error);
    }
  };

  return (
    <div className="App">
      <h1>OneSignal + Glide Integration</h1>
      {isReady ? (
        <button onClick={handlePrompt}>Enable Push Notifications</button>
      ) : (
        <p>Loading OneSignal...</p>
      )}
    </div>
  );
}

export default App;
