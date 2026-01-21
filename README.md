# Simplefolio ⚡️ [![GitHub](https://img.shields.io/github/license/cobiwave/simplefolio?color=blue)](https://github.com/cobiwave/simplefolio/blob/master/LICENSE.md) ![GitHub stars](https://img.shields.io/github/stars/cobiwave/simplefolio) ![GitHub forks](https://img.shields.io/github/forks/cobiwave/simplefolio)

## A minimal portfolio template for Developers!

<h2 align="center">
  <img src="https://github.com/cobiwave/gatsby-simplefolio/blob/master/examples/example.gif" alt="Simplefolio" width="600px" />
  <br>
</h2>

## Features

⚡️ Modern UI Design + Smooth Animations\
⚡️ One Page Layout\
⚡️ Styled with SCSS (Custom Grid System)\
⚡️ Fully Responsive\
⚡️ Valid HTML5 & CSS3\
⚡️ Built with Vite for Lightning Fast Development\
⚡️ Smooth Scroll Animations with GSAP\
⚡️ Custom Vanilla JavaScript Tilt Effect (No external libraries)\
⚡️ TypeScript Support\
⚡️ Well organized documentation

To view the demo: **[click here](https://the-simplefolio.netlify.app/)**

---

## Why do you need a portfolio? ☝️

- Professional way to showcase your work
- Increases your visibility and online presence
- Shows you're more than just a resume

## Getting Started 🚀

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites 📋

You'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [pnpm](https://pnpm.io/)) installed on your computer.

```
node@v18.0.0 or higher
pnpm@v8.0.0 or higher
git@2.30.1 or higher
```

---

## How To Use 🔧

From your command line, first clone Simplefolio:

```bash
# Clone the repository
$ git clone https://github.com/cobiwave/simplefolio

# Move into the new-version directory
$ cd simplefolio/new-version

# Remove the current origin repository
$ git remote remove origin
```

After that, you can install the dependencies using pnpm:

```bash
# Install dependencies
$ pnpm install

# Start the development server
$ pnpm dev
```

Once your server has started, go to `http://localhost:5173/` to see the portfolio locally.

### Building for Production

```bash
# Build the project
$ pnpm build

# Preview the production build
$ pnpm preview
```

---

## Template Instructions:

### Step 1 - STRUCTURE

Go to `index.html` and put your information, there are 4 sections:

### (1) Hero Section

- On `.hero-title`, put your custom portfolio title.
- On `.hero-cta`, put your custom button label.

```html
<!-- **** Hero Section **** -->
<section id="hero" class="jumbotron">
  <div class="container">
    <h1 class="hero-title load-hidden">
      Hi, my name is <span class="text-color-main">Your Name</span>
      <br />
      I'm the Unknown Developer.
    </h1>
    <p class="hero-cta load-hidden">
      <a rel="noreferrer" class="cta-btn cta-btn--hero" href="#about">
        Know more
      </a>
    </p>
  </div>
</section>
<!-- /END Hero Section -->
```

### (2) About Section

- On `<img>` tag, fill the `src` property with your profile picture path, your picture must be located inside `/public/` folder.
- On `<p>` tag with class name `.about-wrapper__info-text`, include information about you. I recommend putting 2 paragraphs to work well and a maximum of 3 paragraphs.
- On last `<a>` tag, include your CV (.pdf) path on `href` property, your resume CV must be located inside `/public/` folder.

```html
<!-- **** About Section **** -->
<section id="about">
  <div class="container">
    <h2 class="section-title load-hidden">About me</h2>
    <div class="row about-wrapper">
      <div class="col-md-6 col-sm-12">
        <div class="about-wrapper__image load-hidden">
          <img
            alt="Profile Image"
            class="img-fluid rounded shadow-lg"
            height="auto"
            width="300px"
            src="/profile.jpg"
            alt="Profile Image"
          />
        </div>
      </div>
      <div class="col-md-6 col-sm-12">
        <div class="about-wrapper__info load-hidden">
          <p class="about-wrapper__info-text">
            This is where you can describe yourself. The more you describe
            yourself, the more chances you have!
          </p>
          <p class="about-wrapper__info-text">
            Extra Information about you! like hobbies and your goals.
          </p>
          <span class="d-flex mt-3">
            <a
              rel="noreferrer"
              target="_blank"
              class="cta-btn cta-btn--resume"
              href="/resume.pdf"
            >
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

### (3) Projects Section

- Each project lives inside a `row`.
- On `<h3>` tag with class name `.project-wrapper__text-title`, include your project title.
- On `<p>` tag with `lorem ipsum` text, include your project description.
- On first `<a>` tag, put your project url on `href` property.
- On second `<a>` tag, put your project repository url on `href` property.

---

- Inside `<div>` tag with class name `.project-wrapper__image`, put your project image url on the `src` of the `<img>` and put again your project url in the `href` property of the `<a>` tag.
- Recommended size for project image (1366 x 767), your project image must be located inside `/public/` folder.

```html
<!-- **** Projects Section **** -->
<section id="projects">
  ...
  <!-- Notice: each .row is a project -->
  <div class="row">
    <div class="col-lg-4 col-sm-12">
      <div class="project-wrapper__text load-hidden">
        <h3 class="project-wrapper__text-title">Project Title</h3>
        <div>
          <p class="mb-4">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi
            neque, ipsa animi maiores repellendus distinctio aperiam earum dolor
            voluptatum consequatur blanditiis inventore debitis fuga numquam
            voluptate ex architecto itaque molestiae.
          </p>
        </div>
        <a
          rel="noreferrer"
          target="_blank"
          class="cta-btn cta-btn--hero"
          href="#!"
        >
          See Live
        </a>
        <a
          rel="noreferrer"
          target="_blank"
          class="cta-btn text-color-main"
          href="#!"
        >
          Source Code
        </a>
      </div>
    </div>
    <div class="col-lg-8 col-sm-12">
      <div class="project-wrapper__image load-hidden">
        <a rel="noreferrer" href="#!" target="_blank">
          <div
            data-tilt
            data-tilt-max="4"
            data-tilt-glare="true"
            data-tilt-max-glare="0.5"
            class="thumbnail rounded js-tilt"
          >
            <img
              alt="Project Image"
              class="img-fluid"
              src="/project.jpg"
            />
          </div>
        </a>
      </div>
    </div>
  </div>
  <!-- /END Project -->
  ...
</section>
```

### (4) Contact Section

- On `<p>` tag with class name `.contact-wrapper__text`, include some custom call-to-action message.
- On `<a>` tag, put your email address on `href` property.

```html
<!-- **** Contact Section **** -->
<section id="contact">
  <div class="container">
    <h2 class="section-title">Contact</h2>
    <div class="contact-wrapper load-hidden">
      <p class="contact-wrapper__text">[Put your call to action here]</p>
      <a
        rel="noreferrer"
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

### (5) Footer Section

- Put your Social Media URL on each `href` attribute of the `<a>` tags.
- If you have an additional Social Media account different than Twitter, LinkedIn, or GitHub, go to [Font Awesome Icons](https://fontawesome.com/v4.7.0/icons/) and search for the icon's class name you are looking for.
- You can delete or add as many `<a>` tags as you want.

```html
<footer class="footer navbar-static-bottom">
  ...
  <div class="social-links">
    <a href="#!" target="_blank">
      <i class="fa fa-twitter fa-inverse"></i>
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

Change the color theme of the website - (choose 2 colors to create a gradient)

Go to `src/styles/abstracts/_variables.scss` and only change the values for these variables `$primary-color` and `$secondary-color` with your preferred HEX color.

If you want to get some gradients inspiration I highly recommend you to check this website [UI Gradient](https://uigradients.com/#BrightVault)

```scss
// Default values
$primary-color: #02aab0;
$secondary-color: #00cdac;
```

### Step 3 - ANIMATIONS (Optional)

You can customize the GSAP animations by modifying the configuration in `src/scripts/scrollAnimations.ts`. Adjust timing, easing, and other animation properties to match your preferences.

---

## Deployment 📦

Once you finish your setup, you need to put your website online!

I highly recommend using [Netlify](https://netlify.com) or [Vercel](https://vercel.com) because they are super easy and free.

### Deploy to Netlify

```bash
# Build your project
$ pnpm build

# The dist folder will contain your built site
# Drag and drop it to Netlify or use the CLI
```

### Deploy to Vercel

```bash
# Install Vercel CLI
$ npm i -g vercel

# Deploy
$ vercel
```

## Technologies used 🛠️

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types
- [GSAP](https://greensock.com/gsap/) - Professional-grade JavaScript animation
- [Sass](https://sass-lang.com/documentation) - CSS extension language
- Custom Vanilla JavaScript Tilt Effect - No external dependencies

## Differences from v1

This version includes several improvements over the original:

- ⚡️ **Vite instead of Parcel** - Much faster development and build times
- 🎨 **No Bootstrap** - Lightweight custom grid system
- 🎭 **GSAP instead of ScrollReveal** - More powerful and flexible animations
- 🎯 **Custom Tilt Effect** - No vanilla-tilt dependency, pure TypeScript implementation
- 📦 **TypeScript** - Better developer experience with type safety
- 🚫 **No jQuery or Popper.js** - Modern vanilla JavaScript only

## Authors

- **Jacobo Martinez** - [https://github.com/cobiwave](https://github.com/cobiwave)

## License 📄

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments 🎁

I was motivated to create this project because I wanted to contribute something useful for the dev community, thanks to [ZTM Community](https://github.com/zero-to-mastery) and [Andrei](https://github.com/aneagoie)
