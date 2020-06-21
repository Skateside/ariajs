# ARIA.js

A helper library for working with WAI-ARIA attributes, designed to make manipulating them as simple as possible.

## Documentation

The documentation for this library can be found in [the docs](docs/overview.md).

## Browser Support

This library has been tested in the latest browsers as well as IE11, but it may require these parts to be polyfilled:

- `Object.assign()`
- `Object.entries()`
- `Array.from()`
- `String.prototype.startsWith()`
- `Number.isNaN`
- `Proxy`

### A Note About `Proxy`

AriaJS uses the set, get and deleteProperty traps from `Proxy`. This allows you to simply work with the `aria` object and the markup will be automatically updated. For example, the attribute can be removed like this:

```js
// <button type="button" aria-expanded="true">Toggle</button>
var aria = new Aria(document.querySelector("button"));
delete aria.expanded;
// <button type="button">Toggle</button>
```

If you need to support IE11, or another browser that doesn't understand `Proxy`, the `delete` keyword won't work. Because the deleteProperty trap cannot be polyfilled, some polyfills will throw an error if it's used. To get around that, you can add the "no-proxy" plugin. To remove the attribute with that plugin enabled, either use `element.removeAttribute` or set the property to an empty string.

```js
// <button type="button" aria-expanded="true">Toggle</button>
var aria = new Aria(document.querySelector("button"));
aria.expanded = "";
// <button type="button">Toggle</button>
```

For `listType` and `referenceListType` properties, the attribute can be removed by setting the value to an empty array as well.

```js
// <button type="button" controls="element-id">Toggle</button>
var aria = new Aria(document.querySelector("button"));
aria.controls = [];
// <button type="button">Toggle</button>
```

You can use the [no-proxy plugin](docs/plugins.md#no-proxy-plugin) if you need to support older browsers.

## Unit Test Troubleshooting

PhantomJS currently doesn't understand `Proxy`, which AriaJS uses. If you run `gulp test`, you may see this error:

> Can't find variable: Proxy

This will happen because the no-proxy plugin hasn't been loaded. Run `gulp plugins` to make sure the file has been written, then `gulp test` will work correctly.

## Building Aria.js

Aria.js compiles using gulp. There are a number of gulp tasks available for developing and compiling Aria.js

### `gulp js`

The command `gulp js` will compile the base Aria.js file into the "dist" folder, along with a minified version and sourcemaps. These files are called:

- `aria.js` - the compiled Aria.js file.
- `aria.js.map` - the source map for `aria.js`.
- `aria.min.js` - the minified version of `aria.js`.
- `aria.min.js.map` - the source map for `aria.min.js`.

There's also a variant called `gulp js:watch` which will watch for file changes and re-compile the files.

### `gulp plugins`

The `gulp plugins` command will compile and minify the plugin files into the "dist/plugins" folder. They can either be added separately or concatenated using the [`gulp build`](#gulp-build) command.

There's a veriant called `gulp plugins:watch` which will watch for changes to the plugin files and will re-compile them.

You can see a list of all the plugins using `gulp plugins:list`.

### `gulp test`

The `gulp test` command will run the unit tests and show their results. THe `gulp test:watch` command will watch for any file changes and re-run the tests. Because the files and plugins need to be compiled before testing, the [`gulp full`](#gulp-full) command will do all of them.

### `gulp full`

The `gulp full` command will execute [`gulp js`](#gulp-js) and [`gulp plugins`](#gulp-plugins) commands before the [`gulp test`](#gulp-test). It's a simple way of testing.

### `gulp watch`

The `gulp watch` command executes both the [`gulp js:watch`](#gulp-js) and the [`gulp test:watch`](#gulp-test) commands.

### `gulp custom`

The `gulp custom` command will create a custom version of Aria.js which includes any plugins that you wish to include. You can define the plugins using the `--plugins` argument and give it a space-separated list of plugins to include. For example, this command will create a version of Aria.js that includes the no-proxy and extend-node plugins:

```bash
$ gulp custom --plugins "no-proxy extend-node"
```

You can also use the value "all" to include all the plugins.

```bash
$ gulp custom --plugins "all"
```

The list of available plugins can be found by using the [`gulp plugins:list`](#gulp-plugins) command and they're all detailed on the [plugins page](docs/plugins.md).

The `gulp custom` command will create 2 files in the "dist" folder:

- `aria.custom.js` - the concatentated file with the plugins.
- `aria.custom.min.js` - the minified version of `aria.custom.js`.

The `gulp custom` command needs the [`gulp js`](#gulp-js) command to have executed. The [`gulp build`](#gulp-build) command will execute both.

### `gulp build`

The `gulp build` command executes [`gulp js`](#gulp-js) and then the [`gulp custom`](#gulp-custom) command. It can also take a `--plugins` argument.
