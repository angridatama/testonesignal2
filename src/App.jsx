"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function App() {
  useEffect(() => {
    const initOneSignal = async () => {
      try {
        if (typeof window !== "undefined") {
          await OneSignal.init({
            appId: "fcf28885-6e95-4401-8235-e8223ab2e898",
            notifyButton: {
              enable: true,
            },
            // allowLocalhostAsSecureOrigin: true, // Uncomment if testing locally
          });

          // Wait until OneSignal is ready
          OneSignal.on('subscriptionChange', async (isSubscribed) => {
            if (isSubscribed) {
              try {
                const userId = await OneSignal.getUserId(); // This is the OneSignal Player ID
                const userEmail = "user@example.com"; // Replace with logic to get actual user's email

                // Send to Glide webhook
                const response = await fetch(
                  "https://go.glideapps.com/api/container/plugin/webhook-trigger/nyEQtv7S4N1E2SfxTuax/80a82896-f99a-40e0-a71c-c35eeb5f11a2",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer fda014a4-0721-45b2-a1d8-4691500ae2da",
                    },
                    body: JSON.stringify({ email: userEmail, userId }),
                  }
                );

                if (!response.ok) {
                  console.error("Failed to send data to Glide", await response.text());
                } else {
                  console.log("Sent to Glide:", { email: userEmail, userId });
                }
              } catch (error) {
                console.error("Error during OneSignal ID fetch or webhook:", error);
              }
            }
          });
        }
      } catch (err) {
        console.error("OneSignal SDK failed to initialize:", err);
      }
    };

    initOneSignal();
  }, []);

  return (
    <div>
      <h1>Hello, world!</h1>
    </div>
  );
}
