import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/anybody/wdth.css";
import "@fontsource-variable/public-sans/wght.css";
import App from "./App";
import "./index.css";

const root = document.getElementById("root")!;

// Production HTML is prerendered (scripts/prerender.mjs); the dev server serves an empty root.
if (root.hasChildNodes()) {
  hydrateRoot(root, <App />);
} else {
  createRoot(root).render(<App />);
}
