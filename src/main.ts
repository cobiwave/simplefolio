import "./styles/main.scss";
import { initScrollAnimations } from "./scripts/scrollAnimations";
import { initTiltEffect } from "./scripts/tiltEffect";
import initDebugGrid from "./scripts/debugGrid";

// Initialize animations when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  initScrollAnimations();
  initTiltEffect();
  initDebugGrid();
});
