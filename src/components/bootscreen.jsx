import { useEffect, useState } from "react";

export default function BootScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [showConnect, setShowConnect] = useState(false);
  const [showConnected, setShowConnected] = useState(false);
  const [showLaunch, setShowLaunch] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);

          setTimeout(() => setShowConnect(true), 500);
          setTimeout(() => setShowConnected(true), 1500);
          setTimeout(() => setShowLaunch(true), 2500);

          setTimeout(() => {
            onFinish();
          }, 4000);

          return 100;
        }

        return prev + 1;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="boot-screen">
      <div className="terminal">

        <p>{">"} Initializing Jitarth.exe</p>

        <p>
          {">"} Loading Projects {progress}%
        </p>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        {showConnect && (
          <p>{">"} Connecting to NIT Delhi...</p>
        )}

        {showConnected && (
          <p>{">"} Connected ✔</p>
        )}

        {showLaunch && (
          <p>{">"} Launching Portfolio...</p>
        )}
      </div>
    </div>
  );
}