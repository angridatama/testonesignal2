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
          autoRegister: false, // Manual prompt
        });

        // Event: when permission prompt shows
        OneSignal.Notifications.addEventListener("permissionPromptDisplay", () => {
          console.log("Permission prompt displayed.");
        });

        // Event: when permission is changed (allowed/blocked/dismissed)
        OneSignal.Notifications.addEventListener("permissionChange", (permission) => {
          console.log(`Permission changed: ${permission ? "granted" : "denied"}`);
        });

        // Event: notification click
        OneSignal.Notifications.addEventListener("click", (event) => {
          console.log("Notification clicked:", event);
        });

        setIsReady(true);
      });
    }
  }, []);

  const handlePrompt = async () => {
    try {
      // Show permission prompt
      await window.OneSignal.Slidedown.promptPush({ force: true });

      const isPushEnabled = await window.OneSignal.Notifications.isPushEnabled();
      console.log("Push Enabled:", isPushEnabled);

      if (!isPushEnabled) {
        alert("You need to allow notifications to continue.");
        return;
      }

      // Retry getting OneSignal ID
      const waitForUserId = async () => {
        let tries = 0;
        while (tries < 10) {
          const id = await window.OneSignal.User.onesignalId;
          if (id) return id;
          await new Promise(res => setTimeout(res, 500));
          tries++;
        }
        return null;
      };

      const onesignalId = await waitForUserId();
      console.log("OneSignal ID:", onesignalId);

      if (!onesignalId) {
        console.error("Failed to get OneSignal user ID.");
        return;
      }

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
        console.error("Failed to send to Glide:", errorText);
      } else {
        alert("Sent OneSignal ID to Glide!");
      }
    } catch (err) {
      console.error("Prompt error:", err);
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
