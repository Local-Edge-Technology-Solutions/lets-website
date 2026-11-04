import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";

// Used at build time only: scripts/prerender.mjs puts this HTML into index.html.
export function render() {
  return renderToString(
    <Router ssrPath="/">
      <App />
    </Router>,
  );
}
