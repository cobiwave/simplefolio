import getUAString from "../utils/userAgent.js";
export default function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}