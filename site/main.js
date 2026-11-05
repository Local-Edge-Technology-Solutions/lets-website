// The one module entry. GSAP, ScrollTrigger and SplitText are imported and registered in js/env.js.
// Each part upgrades HTML that already works on its own; a failure in one never hides another's content.
import { fontsReady } from "./js/env.js";
import { initMenu } from "./js/menu.js";
import { initVoicemail } from "./js/voicemail.js";
import { initAsk } from "./js/ask.js";
import { initBusy } from "./js/busy.js";
import { initDock } from "./js/dock.js";
import { initCalculator } from "./js/calculator.js";
import { initForm } from "./js/form.js";
import { initWork } from "./js/work.js";
import { initMotion } from "./js/motion.js";

const safely = (name, fn) => {
  try { fn(); } catch (error) { console.error(`LETS: ${name} did not start`, error); }
};

safely("menu", initMenu);
safely("voicemail", initVoicemail);
safely("ask", initAsk);
safely("busy", initBusy);
safely("dock", initDock);
safely("calculator", initCalculator);
safely("form", initForm);
safely("work", initWork);
// Motion measures type, so it waits for the face (bounded), after the controls above are in place.
fontsReady().then(() => safely("motion", initMotion));
