<h1 align="center">
  🔥 Simplefolio 🔥
</h1>

<h2 align="center">
  A FREE Beautiful Portfolio Template for Developers!
</h2>

Feel free to use it as-is or customize it as much as you want. I wanted to build a clean, beautiful and simple template without any unnecessary bloat.

<h2 align="center">
  <a href="https://github.com/amitmerchant1990/pomolectron">
    <img src="https://github.com/cobimr/simplefolio/blob/master/example.gif" alt="Pomolectron" width="600px">
  </a>
</h2>

To view a live demo, **[click here](https://simplefolio.netlify.com/)**

**IMPORTANT NOTE:** You are 100% allowed to use this template for both personal and commercial use, but NOT to claim it as your own design. A credit to the original author, Jacobo Martinez, is of course highly appreciated

---

## Getting Started 🚀

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites 📋

You need to have installed on your computer:

```
node@v10.16.0
npm@6.9.0
```

---

## How To Use 🔧

To clone and run Simplefolio, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/cobimr/simplefolio

# Go into the repository
$ cd simplefolio

# Install dependencies
$ npm install

# Run the app
$ npm start
```

Once your server has started, go to this url `http://localhost:8080/` and you will see the portfolio running on a dev-server:

IMAGEN GOES HERE

---

## Template Instructions:

### Step 1

Fill your information, they are 5 sections:

**Header Section** - Edit the `h1` and `p` in the jumbotron-text `div`.

```
<div>

</div>
```

**About Section** - Edit the `h2` and `p`, or add more, in the main-content `div`.

```
<div>

</div>
```

**Portfolio Section** - Experiences are organized in content-body `div`. There is an `h4` and a `p` that you can edit.

```
<div>

</div>
```

**Contact Section** - Simply cahnge the `address` to include your email address

```
<div>

</div>
```

**Footer Section** - content-body `div` with an editable `p`

```
<div>

</div>
```

### Step 2

Change your color theme ( choose 2 colors to create a gradient ):

Go to `/styles/base/_variables.scss` and change the values on this classes `$main-color` and `$secondary-color` to your prefered choose.

```
  $main-color: #fff;
  $secondary-color: #000
```

---

## Deployment 📦

Add additional notes about how to deploy this on a live system

## Technologies used 🛠️

- [Webpack](https://webpack.js.org/concepts/) - Static module bundler
- [Bootstrap 4](https://getbootstrap.com/docs/4.3/getting-started/introduction/) - Front-end component library
- [Sass](https://sass-lang.com/documentation) - CSS extension language
- [ScrollReveal.js](https://scrollrevealjs.org/) - JavaScript library
- [Tilt.js](https://gijsroge.github.io/tilt.js/) - A tiny requestAnimationFrame

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Authors

- **Jacobo Martinez** - [https://github.com/cobimr](https://github.com/cobimr)

## License 📄

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments 🎁

- I was motivated on create this project because I wanted to contribuit on something useful for the dev community, thanks to [ZTM Community](https://github.com/zero-to-mastery) and @aneagoie
