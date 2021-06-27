import tilt from "tilt.js";

export default function initTilt() {
  $(".js-tilt").tilt({
    maxTilt: 3,
  });
}
