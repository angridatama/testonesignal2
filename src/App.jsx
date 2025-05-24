import { useEffect, useRef, useState } from 'react';
import './styles.css';
import Lottie from 'lottie-web';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [onesignalId, setOnesignalId] = useState(null);
  const [showMarquee, setShowMarquee] = useState(true);
  const [emailDisplay, setEmailDisplay] = useState(null);
  const emailRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");

    if (emailParam) {
      const decodedEmail = decodeURIComponent(emailParam);
      emailRef.current = decodedEmail;
      setEmailDisplay(decodedEmail);
    } else {
      alert("⚠️ No email found in URL");
    }
  }, []);

  useEffect(() => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async function (OneSignal) {
      try {
        await OneSignal.init({
          appId: "Your Onesignal app ID",
          serviceWorkerPath: "OneSignalSDKWorker.js",
          serviceWorkerUpdaterPath: "OneSignalSDKUpdaterWorker.js",
          serviceWorkerParam: { scope: "/" },
          autoResubscribe: true,
          autoRegister: false,
        });

        OneSignal.Notifications.addEventListener("permissionPromptDisplay", () => {
          alert("📢 Notification permission prompt displayed.");
          setShowMarquee(false);
        });

        OneSignal.Notifications.addEventListener("permissionChange", (granted) => {
          alert(`🔄 Notification permission changed: ${granted}`);
        });

        OneSignal.Notifications.addEventListener("click", (event) => {
          alert("🔔 Notification clicked.");
        });

        OneSignal.User.PushSubscription.addEventListener("change", async (event) => {
          if (event.current?.token) {
            const onesignalId = event.current.id;
            setOnesignalId(onesignalId);
            setShowMarquee(false);

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
                    email: emailRef.current
                  })
                }
              );

              if (!response.ok) {
                const text = await response.text();
                alert("❌ Failed to send to Glide: " + text);
              } else {
                alert("✅ Sent OneSignal ID and email to Glide!");
              }
            } catch (err) {
              alert("❌ Error sending data to Glide: " + err.message);
            }
          }
        });

        setIsReady(true);
      } catch (err) {
        alert("🚫 OneSignal init error: " + err.message);
      }
    });
  }, []);

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
      if (!state.optedIn) {
        alert("🚨 You need to allow notifications to continue.");
      }

      setShowMarquee(false);
    } catch (err) {
      alert("❌ Prompt error: " + err.message);
    }
  };

  const openGlideAppLink = (
    <a
      href="https://onesignal-testing-aqr2.glide.page/dl/17171d"
      target="_blank"
      rel="noopener noreferrer"
      className="glide-app-button"
    >
      Open the app again
    </a>
  );

  return (
    <div className="App">
      <div id="lottie-container" style={{ width: 200, height: 200 }}></div>
      <h1>OneSignal + Glide Integration</h1>

      {showMarquee && (
        <div className="marquee-container">
          <marquee behavior="scroll" direction="left">
            Please wait for the prompt to show up, and click the prompt if it shows up!
          </marquee>
          <div style={{ marginTop: '1rem' }}>
            {openGlideAppLink}
          </div>
        </div>
      )}

      {onesignalId && (
        <div className="status-box">
          <div className="label">OneSignal ID:</div>
          <div className="id">{onesignalId}</div>

          {emailDisplay && (
            <>
              <div className="label" style={{ marginTop: '1rem' }}>Email:</div>
              <div className="id">{emailDisplay}</div>
              <div style={{ marginTop: '1.5rem' }}>
                {openGlideAppLink}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
