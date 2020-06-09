# ARIA.js

A helper library for working with WAI-ARIA attributes, designed to make manipulating them as simple as possible.

## Open for Beta

`aria.js` is now open for beta testing. If you notice an issue, [please open an issue](https://github.com/Skateside/ariajs/issues). If you want to be really awesome, you can always create a pull request. I'm looking for certain things during this beta test:

- Does this library create any noticeable performance hits?
- Do all features work as expected?
- Is [the documentation](https://github.com/Skateside/ariajs/wiki) easy to follow?

This library _should_ be intuitive and the documentation _should_ be easy to understand. If this isn't the case, please let me know.

If you want to contact me without raising an issue, you can find me on Twitter: [@Skateside](https://twitter.com/Skateside). I'd love to see how you're using this library or whether you (dis)like any features of it.

## Documentation

The documentation for this library can be found in [the Wiki](https://github.com/Skateside/ariajs/wiki).

## Building ARIA.js

To build `aria.js` from the source files, simply run a gulp task:

```bash
gulp build
```

This will create a "dist" folder containing `aria.custom.js` (and a minified version and maps of both).

You can add and [official plugins](https://github.com/Skateside/ariajs/wiki/Plugins) using the optional `--plugins` option (which has the alias `--p`). Just pass the name of the plugin without the leading "aria." or the trailing ".js" (e.g. "tokens" instead of "aria.tokens.js").

```bash
gulp build --plugins extendNode

# Shorter version:
gulp build --p extendNode
```

You will now have a version of `aria.js` which also includes the [aria.extendNode.js](https://github.com/Skateside/ariajs/wiki/aria.extendNode.js) plugin. The `--plugins` option can also be a space-separated string of plugins.

```bash
gulp build --plugins "extendNode focus"
```

If you want to include all plugins, you can set the value of the `--plugins` option to "all".

```bash
gulp build --plugins all
```

If you just want `aria.js`, you can use the `gulp js` task. You can also compile all the plugins by running `gulp plugins`.

```bash
# Create ./dist/aria.js, minified version and maps.
gulp js

# Create ./plugins/dist/*, minified versions and maps.
gulp plugins
```

## Browser Support

This library has been tested in the latest browsers as well as IE11, but it may require these parts to be polyfilled:

- `Object.assign()`
- `Object.entries()`
- `Array.from()`
- `String.prototype.startsWith()`
- `Proxy`

Please be aware that this library uses the `deleteProperty` trap and some polyfills will throw an error because that trap cannot be polyfilled. If you need to support IE11 (or another browser that doesn't understand `Proxy`) we recommend that you include the "no-proxy" plugin and either remove the attribute (`element.removeAttribute`) or set the value to an empty string (`aria.property = ""`) to delete the property.

## Gulp tasks

Gulp task | Description | Watch version
---|---|---
`gulp build` | Builds `aria.custom.js`. This is the main task you'll use. | (none)
`gulp js` | Creates `aria.js` from the source files in `./src/`. | `gulp js:watch`
`gulp plugins` | Creates the plugins from their source files in `./plugins/src/` | `gulp plugins:watch`
`gulp test` | Runs the unit tests for `aria.js`. You will need to run `gulp js` first. | `gulp test:watch`
`gulp watch` | Runs `gulp js:watch`, `gulp plugins:watch` and `gulp test:watch` | (none)
