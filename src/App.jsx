import { useEffect } from "react";
import OneSignal from "react-onesignal";

const userEmail = "user@example.com"; // Replace with actual user email

function App() {
  useEffect(() => {
    async function initializeOneSignal() {
      try {
        await OneSignal.init({
          appId: "fcf28885-6e95-4401-8235-e8223ab2e898",
          notifyButton: {
            enable: true,
          },
          allowLocalhostAsSecureOrigin: true,
        });

        // Wait for subscription to be complete
        const isPushSupported = await OneSignal.isPushNotificationsSupported();
        if (!isPushSupported) {
          console.warn("Push not supported");
          return;
        }

        const isSubscribed = await OneSignal.isPushNotificationsEnabled();
        if (isSubscribed) {
          const userId = await OneSignal.getUserId();

          console.log("OneSignal User ID:", userId);

          // Send to Glide webhook
          fetch("https://go.glideapps.com/api/container/plugin/webhook-trigger/nyEQtv7S4N1E2SfxTuax/80a82896-f99a-40e0-a71c-c35eeb5f11a2", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer fda014a4-0721-45b2-a1d8-4691500ae2da",
            },
            body: JSON.stringify({ email: userEmail, userId }),
          }).then(res => console.log("Sent to Glide:", res.status))
            .catch(err => console.error("Error sending to Glide:", err));
        } else {
          console.log("User has not subscribed yet.");
        }
      } catch (error) {
        console.error("OneSignal SDK failed to initialize:", error);
      }
    }

    if (typeof window !== "undefined") {
      initializeOneSignal();
    }
  }, []);

  return (
    <div>
      <h1>OneSignal + Glide Integration</h1>
      <p>Push prompt should show up automatically.</p>
    </div>
  );
}

export default App;
