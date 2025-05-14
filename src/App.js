import { useEffect } from "react";
import OneSignal from "react-onesignal";

function App() {
  useEffect(() => {
    const initOneSignal = async () => {
      try {
        if (typeof window !== "undefined") {
          await OneSignal.init({
            appId: "fcf28885-6e95-4401-8235-e8223ab2e898", // ← Replace with your App ID
            notifyButton: { enable: true },
            allowLocalhostAsSecureOrigin: true, // Needed for local testing
          });

          // Optional: Attach tags or email
          const queryParams = new URLSearchParams(window.location.search);
          const email = queryParams.get("email");
          if (email) {
            try {
              await OneSignal.setEmail(email);
              await OneSignal.sendTag("user_email", email);
              console.log("✅ Email and tag set:", email);
            } catch (tagError) {
              console.warn("⚠️ Error setting email/tag:", tagError);
            }
          }

          console.log("✅ OneSignal initialized");
        }
      } catch (err) {
        console.error("❌ OneSignal init failed:", err);
      }
    };

    initOneSignal();
  }, []);

  return (
    <div>
      <h1>🚀 OneSignal React Integration</h1>
      <p>If everything worked, you’ll see the notification prompt.</p>
    </div>
  );
}

export default App;