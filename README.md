# 🔥 Simplefolio 🔥

A **FREE** Beautiful Portfolio Template for Developers!

This repo is an easily customizable personal portfolio template. Feel free to use it as-is or customize it as much as you want. I wanted to build a clean, beautiful and simple template without any unnecessary bloat.

To view a live demo, **[click here](https://simplefolio.netlify.com/)**

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

You need to have installed on your computer:

```
node
npm
```

### Installing

1) Clone this repository using:

```
$ git clone https://github.com/cobimr/simplefolio.git
```

2) Once you have the repo on your computer, install it locally using npm:

```
$ cd simplefolio/
$ npm install
```

3) Start a development server using:

```
$ npm start
```

4) Once your start the server, go to this url `http://localhost:3000/` and you will see the portfolio on live mode:

IMAGEN GOES HERE

## Instructions:

Step 1 - Fill your information, they are 5 sections:
---

**Header** - Edit the `h1` and `p` in the jumbotron-text `div`.
```
<div class="jumbotron-text">
  <h1>Brandon Morelli</h1>
  <p>Full-Stack Web Developer in Boston, Ma.</p>
</div>
```

**About** - Edit the `h2` and `p`, or add more, in the main-content `div`.

```
<div class="main-content">
  <div class="content-header">
    <a class="anchor" name="about"></a>
    <h2>About</h2>
  </div>
  <div class="content-body">
    <p>text here</p>
    <p>text here</p>
  </div>
</div>
```

**Portfolio** - Experiences are organized in content-body `div`. There is an `h4` and a `p` that you can edit.
```
<div class="content-body">
  <div class="card">
    <div class="card-header">
      <h4>Company <span class="job-title">Job Title</span></h4>
    </div>
   <div class="card-content">
    <p>Paragraph text</p>
   </div>
</div>
```

**Contact** - Simply cahnge the `address` to include your email address
```
<form method="POST" action="https://formspree.io/email@email.com">
```

**Footer** - content-body `div` with an editable `p`
```
          <div class="content-body">
            <p>Copyright YOUR NAME 2017</p>
          </div>
```

Step 2 - Change your color theme ( choose 2 colors to create a gradient ):
---

Go to `/styles/base/_variables.scss` and change the values on this classes `$main-color` and `$secondary-color` to your prefered choose.
```
  $main-color: #fff;
  $secondary-color: #000
```

## Deployment

Add additional notes about how to deploy this on a live system

## Technologies used

* [Webpack](http://www.dropwizard.io/1.0.2/docs/) - Static module bundler
* [Bootstrap 4](https://getbootstrap.com/docs/4.3/getting-started/introduction/) - Front-end component library
* [Sass](https://sass-lang.com/documentation) - CSS extension language
* [ScrollReveal.js](https://scrollrevealjs.org/) - JavaScript library
* [Tilt.js](https://gijsroge.github.io/tilt.js/) - A tiny requestAnimationFrame

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

* **Jacobo Martinez** - [https://github.com/cobimr](https://github.com/cobimr)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* I was motivated to create this project for the [ZTM Community](https://github.com/zero-to-mastery)
