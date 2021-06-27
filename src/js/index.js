import initTilt from "./tilt";
import initSr from "./sr";
import initAnimations from "./animation";
import { addResume } from "./utils";
import resume from "../assets/resume.pdf";

export default function initApp() {
  initSr();
  initTilt();
  initAnimations();
  // comment this if you don't want to attach your resume
  addResume(resume);
}
