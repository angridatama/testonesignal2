import { useEffect, useState } from 'react';

function App() {
  const [onesignalReady, setOnesignalReady] = useState(false);

  useEffect(() => {
    // Defer OneSignal setup until SDK loads
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal) {
      await OneSignal.init({
        appId: "fcf28885-6e95-4401-8235-e8223ab2e898",
        serviceWorkerPath: "OneSignalSDKWorker.js",
        serviceWorkerUpdaterPath: "OneSignalSDKUpdaterWorker.js",
        serviceWorkerParam: { scope: "/" },
        autoResubscribe: true,
      });

      setOnesignalReady(true); // Flag that OneSignal is ready
    });
  }, []);

  const handleSubscribe = async () => {
    try {
      const permission = await window.OneSignal.Notifications.requestPermission();

      if (permission !== 'granted') {
        console.warn("Push notification permission not granted:", permission);
        return;
      }

      const onesignalUserId = await window.OneSignal.User.getId();
      console.log("OneSignal User ID:", onesignalUserId);

      if (!onesignalUserId) {
        console.error("Failed to retrieve OneSignal User ID.");
        return;
      }

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
    } catch (error) {
      console.error("Error during OneSignal setup or sending to Glide:", error);
    }
  };

  return (
    <div className="App">
      <h1>OneSignal + Glide Integration</h1>
      {onesignalReady ? (
        <button onClick={handleSubscribe}>Enable Push Notifications</button>
      ) : (
        <p>Loading OneSignal...</p>
      )}
    </div>
  );
}

export default App;
