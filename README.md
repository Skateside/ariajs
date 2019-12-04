# ARIA.js

A helper library for working with WAI-ARIA attributes, designed to make manipulating them as simple as possible.

## Documentation

The documentation for this library can be found in [the Wiki](https://github.com/Skateside/ariajs/wiki).

_NOTE: the documentation is for the old version of the library!_

## Building

ARIA.js uses webpack to compile the files. There are 3 commands that you can use:

- `yarn build` builds the production (minified) version of aria.js in `dist/aria.js`.
- `yarn build-dev` builds the development version of aria.js in `dist/aria.js` and includes a sourcemap in `dist/aria.js.map`.
- `yarn test` runs the unit tests. Be sure to run `yarn build-dev` before running `yarn test`.

## Browser Support

ARIA.js will require some polyfills to work in IE11:

- [`CustomEvent`](https://www.npmjs.com/package/custom-event-polyfill)
- [`Number.isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN#Polyfill)
- [`Proxy`](https://www.npmjs.com/package/es6-proxy-polyfill) (note that ARIA.js uses Proxy's `deleteProperty` trap which can rarely be polyfilled)
- [`Symbol`](https://github.com/rousan/symbol-es6)

Because this uses some features that are difficult to polyfill correctly, ARIA.js isn't guaranteed to work fully in IE11.
