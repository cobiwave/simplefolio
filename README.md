# Simplefolio ⚡️ [![GitHub](https://img.shields.io/github/license/cobidev/simplefolio?color=blue)](https://github.com/cobidev/simplefolio/blob/master/LICENSE.md) ![GitHub stars](https://img.shields.io/github/stars/cobidev/simplefolio) ![GitHub forks](https://img.shields.io/github/forks/cobidev/simplefolio)

## A minimal portfolio template for Developers!

<h2 align="center">
  <img src="https://github.com/cobidev/gatsby-simplefolio/blob/master/examples/example.gif" alt="Simplefolio" width="600px" />
  <br>
</h2>

**_IMPORTANT NOTE_**: New fastest version came out, built with React + Gatsby! 🎉🎉🎉 See more: [Gatsby Simplefolio](https://github.com/cobidev/gatsby-simplefolio)

<h2 align="center">
  <img src="https://media.giphy.com/media/3oFzmq6Kj4yXZUVHmE/giphy.gif" alt="Look up!" width="600px" />
  <br>
</h2>

## Features

⚡️ Modern UI Design + Reveal Animations\
⚡️ One Page Layout\
⚡️ Styled with Bootstrap v4.3 + Custom SCSS\
⚡️ Fully Responsive\
⚡️ Valid HTML5 & CSS3\
⚡️ Optimized with Webpack\
⚡️ Well organized documentation

To view a demo example, **[click here](https://simplfolio.netlify.com/)**\
To view a live example, **[click here](https://cobidev.com/)**

---

## Getting Started 🚀

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites 📋

You'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [NPM](http://npmjs.com)) installed on your computer.

```
node@v10.16.0 or higher
npm@6.9.0 or higher
git@2.17.1 or higher
```

Also, you can use [Yarn](https://yarnpkg.com/) instead of NPM ☝️

```
yarn@v1.21.1 or higher
```

---

## How To Use 🔧

From your command line, first clone Simplefolio:

```bash
# Clone this repository
$ git clone https://github.com/cobidev/simplefolio

# Go into the repository
$ cd simplefolio

# Remove current origin repository
$ git remote remove origin
```

Then you can install the dependencies either using NPM or Yarn:

Using NPM:
```bash
# Install dependencies
$ npm install

# Start development server
$ npm start
```
Using Yarn:
```bash
# Install dependencies
$ yarn

# Start development server
$ yarn start
```

**NOTE**:
If your run into issues installing the dependencies with NPM, use this command:

```bash
# Install dependencies with all permissions
$ sudo npm install --unsafe-perm=true --allow-root
```

Once your server has started, go to this url `http://localhost:8080/` and you will see the website running on a Development Server:

<h2 align="center">
  <img src="https://github.com/cobidev/gatsby-simplefolio/blob/master/examples/example.png" alt="Simplefolio" width="100%">
</h2>

---

## Template Instructions:

### Step 1 - STRUCTURE

Go to `/src/template.html` and fill your information, they are 5 sections:

### Hero Section

- On `.hero-title`, put your custom title.
- On `.hero-cta`, put your custom button cta.

```html
<!-- **** Hero Section **** -->
<div id="hero" class="jumbotron">
  <div class="container">
    <h1 class="hero-title" class="load-hidden">
      Hi, my name is <span class="text-color-main">Your Name</span>
      <br />
      I'm the Unknow Developer.
    </h1>
    <p class="hero-cta" class="load-hidden">
      <a class="cta-btn cta-btn--hero" href="#about">Know more</a>
    </p>
  </div>
</div>
<!-- /END Hero Section -->
```

### About Section

- On `<img>` tag, fill the `src` property with your profile picture, your picture must be located inside `assets/` folder.
- On `<p>` tag with class-name `.about-wrapper__info-text`, include information about you, I recommend to use 2 paragraphs in order to work well and a maximum of 3 paragraphs.
- On last `<a>` tag, include your resume url on `href` property.

```html
<!-- **** About Section **** -->
<section id="about">
  <div class="container">
    <h2 class="section-title">
      About me
    </h2>
    <div class="row about-wrapper">
      <div class="col-md-6 col-sm-12">
        <div class="about-wrapper__image">
          <img
            class="img-fluid rounded shadow-lg"
            height="auto"
            width="300px"
            src="./assets/profile.jpg"
            alt="Profile Image"
          />
        </div>
      </div>
      <div class="col-md-6 col-sm-12">
        <div class="about-wrapper__info">
          <p class="about-wrapper__info-text">
            Lorem ipsum dolor sit, about my text.
          </p>
          <p class="about-wrapper__info-text">
            Lorem ipsum dolor sit, about my text.
          </p>
          <span class="d-flex mt-3">
            <a target="_blank" class="cta-btn cta-btn--resume" href="#!">
              View Resume
            </a>
          </span>
        </div>
      </div>
    </div>
  </div>
</section>
<!-- /END About Section -->
```

### Projects Section

- Each project lives inside on a `row`.
- On `<h3>` tag with class-name `.project-wrapper__text-title`, include your project title.
- On `<p>` tag with `loremp ipsum` text, include your project information.
- On first `<a>` tag, put your project url on `href` property.
- On second `<a>` tag, put your project repository url on `href` property.

---

- Inside `<div>` tag with class-name `.project-wrapper__image`, put your project image url on the `src` of the `<img>` and put again your project url on `href` property of `<a>` tag.
- Recommended size for project image (1366 x 767px), your project image must live on `assets/` folder.

```html
<!-- **** Projects Section **** -->
<section id="projects">
  ...
  <!-- Each .row is a project -->
  <div class="row">
    <div class="col-lg-4 col-sm-12">
      <div class="project-wrapper__text">
        <h3 class="project-wrapper__text-title">[Project Title]</h3>
        <div>
          <p class="mb-4">
            Lorem ipsum dolor sit, my project information.
          </p>
        </div>
        <a target="_blank" class="cta-btn cta-btn--hero" href="#!">
          See Live
        </a>
        <a target="_blank" class="cta-btn text-color-main" href="#!">
          Source Code
        </a>
      </div>
    </div>
    <div class="col-lg-8 col-sm-12">
      <div class="project-wrapper__image">
        <a href="#!" target="_blank">
          <div data-tilt class="thumbnail rounded">
            <img class="img-fluid" src="./assets/project.jpg" />
          </div>
        </a>
      </div>
    </div>
  </div>
  <!-- /END Project block -->
  ...
</section>
```

### Contact Section

- On `<p>` tag with class-name `.contact-wrapper__text`, include some custom call-to-action message.
- On `<a>` tag, put your email address on `href` property.

```html
<!-- **** Contact Section **** -->
<section id="contact">
  <div class="container">
    <h2 class="section-title">
      Contact
    </h2>
    <div class="contact-wrapper">
      <p class="contact-wrapper__text">
        Put here your contact CTA
      </p>
      <a
        target="_blank"
        class="cta-btn cta-btn--resume"
        href="mailto:example@email.com"
        >Call to Action</a
      >
    </div>
  </div>
</section>
<!-- /END Contact Section -->
```

### Footer Section

- Put your social media link on each `<a>` links.
- If you have more social-media accounts, see [Font Awesome Icons](https://fontawesome.com/v4.7.0/icons/) to put the corresponding additional social icon `.class`
- You can delete or add as many `a` links your want.

```html
<footer class="footer navbar-static-bottom">
  ...
  <div class="social-links">
    <a href="#!" target="_blank">
      <i class="fa fa-twitter fa-inverse"></i>
    </a>
    <a href="#!" target="_blank">
      <i class="fa fa-codepen fa-inverse"></i>
    </a>
    <a href="#!" target="_blank">
      <i class="fa fa-linkedin fa-inverse"></i>
    </a>
    <a href="#!" target="_blank">
      <i class="fa fa-github fa-inverse"></i>
    </a>
  </div>
  ...
</footer>
```

### Step 2 - STYLES

Change the color theme of the website ( choose 2 colors to create a gradient ):

Go to `src/styles/abstracts/_variables.scss` and only change the values on this classes `$main-color` and `$secondary-color` to your prefered HEX color

```scss
// Default values
$main-color: #02aab0;
$secondary-color: #00cdac;
```

**NOTE**: I highly recommend to checkout gradients variations on [UI Gradient](https://uigradients.com/#BrightVault)

---

## Deployment 📦

Once you have done with your setup. You need to put your website online!

I highly recommend to use [Netlify](https://netlify.com) to achieve this on the EASIEST WAY

Because this template use Webpack maybe you can get errors during deployment, Please watch my step-by-step video tutorial to successfully upload your Simplefolio Website on Netlify!

**[WATCH NOW MY STEP-BY-STEP TUTORIAL FOR DEPLOYMENT](https://www.youtube.com/watch?v=soaG3GNSxJY)**

## Others versions 👥

[Gatsby Simplefolio](https://github.com/cobidev/gatsby-simplefolio) by [Jacobo Martinez](https://github.com/cobidev)\
[Ember.js Simplefolio](https://github.com/sernadesigns/simplefolio-ember) by [Michael Serna](https://github.com/sernadesigns)

## Technologies used 🛠️

- [Webpack](https://webpack.js.org/concepts/) - Static module bundler
- [Bootstrap 4](https://getbootstrap.com/docs/4.3/getting-started/introduction/) - Front-end component library
- [Sass](https://sass-lang.com/documentation) - CSS extension language
- [ScrollReveal.js](https://scrollrevealjs.org/) - JavaScript library
- [Tilt.js](https://gijsroge.github.io/tilt.js/) - JavaScript tiny parallax library
- [Popper.js](https://popper.js.org/) - JavaScript popover library

## Authors

- **Jacobo Martinez** - [https://github.com/cobidev](https://github.com/cobidev)

## Status

[![Netlify Status](https://api.netlify.com/api/v1/badges/75600296-89eb-4640-9e7e-fa87fba7ce76/deploy-status)](https://app.netlify.com/sites/simplfolio/deploys)

## License 📄

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments 🎁

I was motivated to create this project because I wanted to contribute on something useful for the dev community, thanks to [ZTM Community](https://github.com/zero-to-mastery) and [Andrei](https://github.com/aneagoie)
