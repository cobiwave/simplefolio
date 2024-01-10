// Extended Type definitions for vanilla-tilt 1.8.0
// Project: https://github.com/micku7zu/vanilla-tilt.js
// Definitions by: Livio Brunner <https://github.com/BrunnerLivio>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/**
 * Options which configures the tilting
 */
export interface TiltOptions {
  /**
   * Reverse the tilt direction
   */
  reverse?: boolean;
  /**
   * Max tilt rotation (degrees)
   */
  max?: number;

  /**
   * Starting X tilt rotation (degrees)
   */
  startX?: number;

  /**
   * Starting Y tilt rotation (degrees)
   */
  startY?: number;

  /**
   * Transform perspective, the lower the more extreme the tilt gets.
   */
  perspective?: number;
  /**
   * 2 = 200%, 1.5 = 150%, etc..
   */
  scale?: number;
  /**
   * Speed of the enter/exit transition
   */
  speed?: number;
  /**
   * Set a transition on enter/exit.
   */
  transition?: boolean;
  /**
   * What axis should be enabled. Can be "x" or "y".
   */
  axis?: null | "x" | "y";
  /**
   * If the tilt effect has to be reset on exit.
   */
  reset?: boolean;
  /**
   * Whether the exit reset will go to [0,0] (default) or [startX, startY].
   */
  "reset-to-start"?: boolean;
  /**
   * Easing on enter/exit.
   */
  easing?: string;
  /**
   * if it should have a "glare" effect
   */
  glare?: boolean;
  /**
   * the maximum "glare" opacity
   */
  "max-glare"?: number;
  /**
   * false = VanillaTilt creates the glare elements for you, otherwise
   * you need to add .js-tilt-glare>.js-tilt-glare-inner by yourself
   */
  "glare-prerender"?: boolean;

  // If true, parallax effect will listen to mouse move events on the whole document, not only the selected element
  "full-page-listening"?: boolean;

  // Boolean to enable/disable device orientation detection,
  gyroscope?: boolean;

  // css-selector or link to HTML-element what will be listen mouse events
  "mouse-event-element"?: string;

  // This is the bottom limit of the device angle on X axis,
  // meaning that a device rotated at this angle would tilt the element as if
  // the mouse was on the left border of the element;
  gyroscopeMinAngleX?: number

  // This is the top limit of the device angle on X axis,
  // meaning that a device rotated at this angle would tilt the element as if
  // the mouse was on the right border of the element;
  gyroscopeMaxAngleX?: number

  // This is the bottom limit of the device angle on Y axis,
  // meaning that a device rotated at this angle would tilt the element as if
  // the mouse was on the top border of the element;
  gyroscopeMinAngleY?: number

  // This is the top limit of the device angle on Y axis,
  // meaning that a device rotated at this angle would tilt the element as if
  // the mouse was on the bottom border of the element;
  gyroscopeMaxAngleY?: number

  //How many gyroscope moves to decide the starting position.
  gyroscopeSamples?: number

}

export interface TiltValues {
  /**
   * The current tilt on the X axis
   */
  tiltX: number;
  /**
   * The current tilt on the Y axis
   */
  tiltY: number;
  /**
   * The current percentage on the X axis
   */
  percentageX: number;
  /**
   * The current percentage on the Y axis
   */
  percentageY: number;
}

export interface HTMLVanillaTiltElement extends HTMLElement {
  vanillaTilt: VanillaTilt;
}

/**
 * A smooth 3D tilt javascript library forked from Tilt.js (jQuery version).
 */
export default class VanillaTilt {
  /**
   * Creates a new instance of a VanillaTilt element.
   * @param element The element, which should be a VanillaTilt element
   * @param settings Settings which configures the element
   */
  constructor(element: HTMLElement, settings?: TiltOptions);
  /**
   * Initializes one or multiple elements
   * @param elements The element, which should tilt
   * @param settings Settings, which configures the elements
   */
  static init(elements: HTMLElement | HTMLElement[], settings?: TiltOptions): void;
  /**
   * Resets the styling
   */
  reset(): void;
  /**
   * Get values of instance
   */
  getValues(): TiltValues;
  /**
   * Destroys the instance and removes the listeners.
   */
  destroy(): void;
  /**
   * Start listening to events
   */
  addEventListeners(): void;
  /**
   * Stop listening to events
   */
  removeEventListener(): void;
}
