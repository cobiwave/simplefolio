import initScrollReveal from "./scripts/scrollReveal";
import exScrollReveal from "./scripts/scrollRevealH1";
import initTiltEffect from "./scripts/tiltAnimation";
import { targetElements, defaultProps, headElement } from "./data/scrollRevealConfig";

exScrollReveal(headElement, defaultProps);
initScrollReveal(targetElements, defaultProps);
initTiltEffect();
