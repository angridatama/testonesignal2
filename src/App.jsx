import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

function App() {
  useEffect(() => {
    async function initOneSignal() {
      try {
        await OneSignal.init({
          appId: "fcf28885-6e95-4401-8235-e8223ab2e898",
          serviceWorkerPath: 'OneSignalSDKWorker.js',
          serviceWorkerUpdaterPath: 'OneSignalSDKUpdaterWorker.js',
          serviceWorkerParam: { scope: '/' },
        });

        await OneSignal.showSlidedownPrompt();

        const onesignalUserId = await OneSignal.User.getId();
        console.log('OneSignal User ID:', onesignalUserId);

        if (!onesignalUserId) {
          console.error("Failed to get OneSignal User ID");
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
            body: JSON.stringify({
              onesignalUserId: onesignalUserId,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Failed to send to Glide:", errorText);
        } else {
          console.log("Successfully sent to Glide");
        }
      } catch (error) {
        console.error("Error during OneSignal setup or sending to Glide:", error);
      }
    }

    initOneSignal();
  }, []);

  return (
    <div className="App">
      <h1>OneSignal + Glide Integration</h1>
    </div>
  );
}

export default App;
