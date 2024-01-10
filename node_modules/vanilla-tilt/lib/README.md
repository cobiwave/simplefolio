# vanilla-tilt.js

[![npm version](https://badge.fury.io/js/vanilla-tilt.svg)](https://badge.fury.io/js/vanilla-tilt)

A smooth 3D tilt javascript library forked from [Tilt.js (jQuery version)](https://github.com/gijsroge/tilt.js).

[View landing page (demos)](https://micku7zu.github.io/vanilla-tilt.js/)

### Usage

```html
<body>
  
<!-- your markup element -->
<div class="your-element" data-tilt></div>

<!-- at the end of the body -->
<script type="text/javascript" src="vanilla-tilt.js"></script>
</body>
```

If you want to use this library in IE, you need to include a CustomEvent polyfill: https://github.com/micku7zu/vanilla-tilt.js/issues/49#issuecomment-482711876 or maybe consider the [jQuery version](https://github.com/gijsroge/tilt.js).
### Options
```js
{
    reverse:                false,  // reverse the tilt direction
    max:                    15,     // max tilt rotation (degrees)
    startX:                 0,      // the starting tilt on the X axis, in degrees.
    startY:                 0,      // the starting tilt on the Y axis, in degrees.
    perspective:            1000,   // Transform perspective, the lower the more extreme the tilt gets.
    scale:                  1,      // 2 = 200%, 1.5 = 150%, etc..
    speed:                  300,    // Speed of the enter/exit transition
    transition:             true,   // Set a transition on enter/exit.
    axis:                   null,   // What axis should be enabled. Can be "x" or "y".
    reset:                  true,   // If the tilt effect has to be reset on exit.
    "reset-to-start":       true,   // Whether the exit reset will go to [0,0] (default) or [startX, startY]
    easing:                 "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
    glare:                  false,  // if it should have a "glare" effect
    "max-glare":            1,      // the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
    "glare-prerender":      false,  // false = VanillaTilt creates the glare elements for you, otherwise
                                    // you need to add .js-tilt-glare>.js-tilt-glare-inner by yourself
    "mouse-event-element":  null,   // css-selector or link to an HTML-element that will be listening to mouse events
    "full-page-listening":  false,  // If true, parallax effect will listen to mouse move events on the whole document, not only the selected element
    gyroscope:              true,   // Boolean to enable/disable device orientation detection,
    gyroscopeMinAngleX:     -45,    // This is the bottom limit of the device angle on X axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the left border of the element;
    gyroscopeMaxAngleX:     45,     // This is the top limit of the device angle on X axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the right border of the element;
    gyroscopeMinAngleY:     -45,    // This is the bottom limit of the device angle on Y axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the top border of the element;
    gyroscopeMaxAngleY:     45,     // This is the top limit of the device angle on Y axis, meaning that a device rotated at this angle would tilt the element as if the mouse was on the bottom border of the element;
    gyroscopeSamples:       10      // How many gyroscope moves to decide the starting position.
}
```

### Events
```js
const element = document.querySelector(".js-tilt");
VanillaTilt.init(element);
element.addEventListener("tiltChange", callback);
```

### Methods
```js
const element = document.querySelector(".js-tilt");
VanillaTilt.init(element);

// Destroy instance
element.vanillaTilt.destroy();

// Get values of instance
element.vanillaTilt.getValues();

// Reset instance
element.vanillaTilt.reset();

// It also supports NodeList
const elements = document.querySelectorAll(".js-tilt");
VanillaTilt.init(elements);
```

### Install
You can copy and include any of the following file:

* [dist/vanilla-tilt.js](https://raw.githubusercontent.com/micku7zu/vanilla-tilt.js/master/dist/vanilla-tilt.js) ~ 15kb
* [dist/vanilla-tilt.min.js](https://raw.githubusercontent.com/micku7zu/vanilla-tilt.js/master/dist/vanilla-tilt.min.js) ~ 8.5kb
* [dist/vanilla-tilt.babel.js](https://raw.githubusercontent.com/micku7zu/vanilla-tilt.js/master/dist/vanilla-tilt.babel.js) ~ 16.5kb
* [dist/vanilla-tilt.babel.min.js](https://raw.githubusercontent.com/micku7zu/vanilla-tilt.js/master/dist/vanilla-tilt.babel.min.js) ~ 9.5kb

#### NPM

Also available on npm https://www.npmjs.com/package/vanilla-tilt

```
npm install vanilla-tilt
```

Import it using

```
import VanillaTilt from 'vanilla-tilt';
```

### Known issues
- [Getting weird rendering issues on Safari](https://github.com/micku7zu/vanilla-tilt.js/issues/22)

### Credits

Original library: [Tilt.js](http://gijsroge.github.io/tilt.js/)

Original library author: [Gijs Rogé](https://twitter.com/GijsRoge)

#### Contributors

- [Livio Brunner](https://github.com/BrunnerLivio) <<a href="mailto:contact@brunnerliv.io">contact@brunnerliv.io</a>> (Typings & Glare Effect)
- [Oleg Postoev](https://github.com/Dok11)
- [Matteo Rigon](https://github.com/matteo-rigon) (Device orientation support)
- [Corey Austin](https://github.com/lazyhummingbird) (Initial gyroscope position)
- [Sander Moolin](https://github.com/SaFrMo)
- [rrroyal](https://github.com/rrroyal) (Whole document mouse events listening)
- [Andžs Pilskalns](https://github.com/Pilskalns) ("reset-to-start" feature)

### Other projects

#### [Quick Cursor: One-Handed mode](https://play.google.com/store/apps/details?id=com.quickcursor) (Android app)
Play Store link: https://play.google.com/store/apps/details?id=com.quickcursor

### Buy me a beer 🍻
If you want to thank me for vanilla-tilt.js or Quick Cursor Android app, you can [donate on PayPal](https://www.paypal.me/micku7zu?locale.x=en_US): https://www.paypal.me/micku7zu?locale.x=en_US

### License

MIT License
