import {rollup} from 'rollup';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import babelrc from 'babelrc-rollup';
import {minify} from 'uglify-es';
import fs from 'fs';

const pkg = require('./package.json');
const external = !!pkg.dependencies ? Object.keys(pkg.dependencies) : [];

/*
 create the lib for publishing to npm
 */

rollup({
  entry: 'src/vanilla-tilt.js',
  plugins: [
    nodeResolve({
      module_es2015: true,
      jsnext: true,
      main: true,
    })
  ],
  external: external
}).then(bundle => bundle.write({
  dest: pkg.module_es2015,
  format: 'es'
})).catch(err => console.log(err.stack));

rollup({
  entry: 'src/vanilla-tilt.js',
  plugins: [
    nodeResolve({
      module_es2015: true,
      jsnext: true,
      main: true,
    }),
    babel(babelrc()),
    commonjs()
  ],
  external: external
}).then(bundle => bundle.write({
  dest: pkg.main,
  format: 'cjs'
})).catch(err => console.log(err.stack));


/*
 create dist for using as script in html
 */
rollup({
  entry: 'src/vanilla-tilt.js',
  plugins: [
    nodeResolve({
      module_es2015: true,
      jsnext: true,
      main: true,
    })
  ],
  external: external
}).then((bundle) => {
  bundle.write({
    moduleName: 'VanillaTilt',
    format: 'iife',
    dest: pkg.distrib,
  }).then(() => {
    const code = minify(fs.readFileSync(pkg.distrib).toString()).code;

    fs.writeFileSync(pkg.distrib.replace('.js', '.min.js'), code);
    return bundle;
  })
}).catch(err => console.log(err.stack));

rollup({
  entry: 'src/vanilla-tilt.js',
  plugins: [
    nodeResolve({
      module_es2015: true,
      jsnext: true,
      main: true
    }),
    babel(babelrc()),
    commonjs()
  ],
  external: external
}).then((bundle) => {
  const dest = pkg.distrib.replace('.js', '.babel.js');
  bundle.write({
    moduleName: 'VanillaTilt',
    format: 'iife',
    dest: dest,
  })
    .then(() => {
      const code = minify(fs.readFileSync(dest).toString()).code;

      fs.writeFileSync(dest.replace('.js', '.min.js'), code);
      return bundle;
    })

}).catch(err => console.log(err.stack));
