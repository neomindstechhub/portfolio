import { createRoot } from "react-dom/client";
import { initAnalytics } from "@/lib/analytics";
import App from "./App";
import "./index.css";

// Unregister any stray service worker from other projects (e.g. neominds-main PWA) on this origin
if (import.meta.env.DEV && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((r) => r.unregister());
  });
}

initAnalytics();
createRoot(document.getElementById("root")!).render(<App />);
