<h1 align="center">
  🔥 Simplefolio 🔥
</h1>

<h2 align="center">
  A FREE UI Portfolio Template for Developers!
</h2>

Feel free to use it as-is or customize it as much as you want. I wanted to build a clean, beautiful and simple template without any unnecessary bloat.

<h2 align="center">
  <img src="https://github.com/cobimr/simplefolio/blob/master/examples/example.gif" alt="Simplefolio" width="600px" />
  <br>
</h2>

To view a live demo, **[click here](https://simplfolio.netlify.com/)**

**IMPORTANT NOTE:** You are 100% allowed to use this template for both personal and commercial use, but NOT to claim it as your own design. A credit to the original author, Jacobo Martinez, is of course highly appreciated.

---

## Getting Started 🚀

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites 📋

You'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer

```
node@v10.16.0 or higher
npm@6.9.0 or higher
git@2.17.1 or higher
```

---

## How To Use 🔧

From your command line, clone and run Simplefolio:

```bash
# Clone this repository
$ git clone https://github.com/cobimr/simplefolio

# Go into the repository
$ cd simplefolio

# Remove current origin repository
$ git remote remove origin

# Install dependencies
$ npm install

# Run the app
$ npm start
```

**NOTE**:
If your run into issues installing the dependencies, use this command:

```bash
$ sudo npm install --unsafe-perm=true --allow-root

# Run the app
$ npm start
```

Once your server has started, go to this url `http://localhost:8080/` and you will see the Website running on a Development Server:

<h2 align="center">
  <img src="https://github.com/cobimr/simplefolio/blob/master/examples/example.png" alt="Simplefolio" width="100%">
</h2>

---

## Template Instructions:

### Step 1

Fill your information, they are 5 sections:

**Header Section** - Edit the `h1` with ID `#opening-text` and `p` with ID `#opening-paragraph`.

```html
<div id="welcome-section" class="jumbotron">
  <div class="container">
    <!-- Opening Text -->
    <h1 id="opening-text">
      Hi, my name is <span class="text-color-main">[YOUR NAME HERE]</span>
      <br />
      I'm the Unknow Developer.
    </h1>
    <!-- /END Opening Text -->

    <!-- Opening Call To Action -->
    <p id="opening-paragraph">
      <a class="cta-btn cta-btn--hero" href="#about">[CALL TO ACTION]</a>
    </p>
  </div>
</div>
```

**About Section**

- Edit the `img` src with your profile picture url, your profile picture must live on `assets/` folder.
- Edit `p` with class `.about-wrapper__info-text` with information about you. I recommend separate each paragraph with 2 `<br />` and max 4 block of text in order to work well.
- Lastly and not mandatory, put your resume link in the `a` button that lives inside `about-wrapper__info`.

```html
<div class="row about-wrapper">
  <div class="col-md-6 col-sm-12">
    <div class="about-wrapper__image">
      <!-- Profile image: change path: ./assets/yourpic.jpg -->
      <img
        class="img-fluid rounded shadow-lg"
        height="auto"
        width="300px"
        src="./assets/[YOUR_IMAGE.png]"
        alt="Profile Image"
      />
      <!-- /END Profile image -->
    </div>
  </div>
  <div class="col-md-6 col-sm-12">
    <div class="about-wrapper__info">
      <!--
        Profile about-text: separate each block of text with 2 <br />
        I recommend to have no more that 4 block of text
      -->
      <p class="about-wrapper__info-text">
        [YOUR ABOUT INFO HERE]
        <!--
          Resume Link: Put your external link for resume.
          If you want you can comment this link
        -->
        <a
          target="_blank"
          class="cta-btn cta-btn--resume"
          href="[YOUR_EXTERNAL_LINK_CV]"
        >
          View Resume
        </a>
        <!-- /END Resume link -->
      </p>
      <!-- /END Profile about text  -->
    </div>
  </div>
</div>
```

**Projects Section**

- Projects are organized in `row` and they lives inside `.project-wrapper`.
- The left-side `col` contains 4 blocks to fill information such as (`project-title, project-information, project-url, project-repo-url`). Fill each information!
- The right-side `col` contains the `img` of the project, place again your `project-url` on the `a` tag that holds the `img` and define the `src` path of your project image. The project `img` must live inside the `assets/` folder.

```html
<!-- Each .row is a project block -->

<div class="row">
  <!-- LEFT SIDE -->
  <div class="col-lg-4">
    <div class="project-wrapper__text">
      <!-- 1) project title -->
      <h3 class="project-wrapper__text-title">[YOUR-PROJECT-TITLE]</h3>
      <!-- 2) project info -->
      <div>
        <p class="mb-4">
          [YOUR-PROJECT-INFORMATION]
        </p>
      </div>
      <!-- 3) project url  -->
      <a
        target="_blank"
        class="cta-btn cta-btn--hero"
        href="[YOUR-PROJECT-URL]"
      >
        See Live
      </a>
      <!-- 4) project repository url -->
      <a
        target="_blank"
        class="cta-btn text-color-main"
        href="[YOUR-PROJECT-REPO-URL]"
      >
        Source Code
      </a>
    </div>
  </div>

  <!-- RIGHT-SIDE -->
  <div class="col-lg-8">
    <div class="project-wrapper__image">
      <!-- 1) project url -->
      <a href="[PROJECT-URL]" target="_blank">
        <div data-tilt class="thumbnail rounded">
          <!-- 2) project image path  -->
          <img class="img-fluid" src="./assets/[YOUR-PROJECT-IMAGE.png]" />
        </div>
      </a>
    </div>
  </div>
</div>
<!-- /END Project block -->
```

**Contact Section** - Simply change the `p` with class `.contact-wrapper__text` and include some call-to-action message. Lastly change your email `address` on the `href` property.

```html
<div class="contact-wrapper">
  <!-- 1) Contact Call To Action: change if necessary -->
  <p class="contact-wrapper__text">
    [YOUR-CONTACT-CALL-TO-ACTION]
  </p>
  <br />
  <!-- 2) Contact mail link: change to your work email & change text if necessary -->
  <a target="_blank" class="cta-btn cta-btn--resume" href="mailto:[YOUR-EMAIL]"
    >Button</a
  >
</div>
```

**Footer Section**

- Put your social media link on each `a` links.
- If you have more social-media accounts, see [Font Awesome Ions](https://fontawesome.com/icons?d=gallery) to put the corresponding additional social icon `.class`
- You can delete or add as many `a` links your want.

```html
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
```

### Step 2

Change the color theme of the website ( choose 2 colors to create a gradient ):

Go to `/styles/abstracts/_variables.scss` and only change the values on this classes `$main-color` and `$secondary-color` to your prefered HEX color

```scss
$main-color: #fff;
$secondary-color: #000;
```

I highly recommend to checkout gradients variations on [UI Gradient](https://uigradients.com/#BrightVault)

---

## Deployment 📦

Once you have done with your setup. You need to put your website online!

I highly recommend to use [Netlify](https://netlify.com)

Because this template use Webpack maybe you can get errors during deployment, Please watch my step-by-step video tutorial to sucessfully upload your Simplefolio Website on Netlify!

**Link: [CLICK HERE!](https://youtube.com)**

## Technologies used 🛠️

- [Webpack](https://webpack.js.org/concepts/) - Static module bundler
- [Bootstrap 4](https://getbootstrap.com/docs/4.3/getting-started/introduction/) - Front-end component library
- [Sass](https://sass-lang.com/documentation) - CSS extension language
- [ScrollReveal.js](https://scrollrevealjs.org/) - JavaScript library

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

- **Jacobo Martinez** - [https://github.com/cobimr](https://github.com/cobimr)

## License 📄

This project is licensed under the GNU GPLv3 License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments 🎁

- I was motivated to create this project because I wanted to contribuit on something useful for the dev community, thanks to [ZTM Community](https://github.com/zero-to-mastery) and [Andrei](https://github.com/aneagoie)
