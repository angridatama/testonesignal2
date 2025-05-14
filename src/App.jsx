import { useEffect, useState } from 'react';
import './styles.css';
import Lottie from 'lottie-web';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [onesignalId, setOnesignalId] = useState(null);
  const [showMarquee, setShowMarquee] = useState(true);
  const [email, setEmail] = useState(null); // New: store email from URL

  // Get email from URL on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
      console.log("Email from URL:", emailParam);
    }
  }, []);

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
        setShowMarquee(false);
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
          setOnesignalId(onesignalId);
          setShowMarquee(false);

          // Send to Glide (with email if available)
          try {
            const response = await fetch(
              "https://go.glideapps.com/api/container/plugin/webhook-trigger/nyEQtv7S4N1E2SfxTuax/80a82896-f99a-40e0-a71c-c35eeb5f11a2",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer fda014a4-0721-45b2-a1d8-4691500ae2da"
                },
                body: JSON.stringify({
                  onesignalUserId: onesignalId,
                  email: email || null
                })
              }
            );

            if (!response.ok) {
              const text = await response.text();
              console.error("Failed to send to Glide:", text);
            } else {
              alert("Sent OneSignal ID and email to Glide!");
            }
          } catch (err) {
            console.error("Error sending data to Glide:", err);
          }
        }
      });

      setIsReady(true);
    });
  }, [email]);

  useEffect(() => {
    if (isReady) {
      Lottie.loadAnimation({
        container: document.querySelector("#lottie-container"),
        animationData: require("./animation/animation.json"),
        renderer: "svg",
        loop: true,
        autoplay: true
      });
    }
  }, [isReady]);

  const handlePrompt = async () => {
    try {
      await window.OneSignal.Slidedown.promptPush({ force: true });

      const state = await window.OneSignal.User.PushSubscription.get();
      console.log("Push subscription state:", state);

      if (!state.optedIn) {
        alert("You need to allow notifications to continue.");
      }

      setShowMarquee(false);
    } catch (err) {
      console.error("Prompt error:", err);
    }
  };

  return (
    <div className="App">
      <div id="lottie-container" style={{ width: 200, height: 200 }}></div>
      <h1>OneSignal + Glide Integration</h1>

      {showMarquee && (
        <div className="marquee-container">
          <marquee behavior="scroll" direction="left">
            Please wait for the prompt to show up, and click the prompt if it shows up!
          </marquee>
        </div>
      )}

      {onesignalId && (
        <div className="status-box">
          <div className="label">OneSignal ID:</div>
          <div className="id">{onesignalId}</div>
          {email && (
            <>
              <div className="label" style={{ marginTop: '1rem' }}>Email:</div>
              <div className="id">{email}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
