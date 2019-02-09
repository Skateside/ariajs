# ARIA.js

A helper library for working with WAI-ARIA attributes, designed to make manipulating them as simple as possible.

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

This library has been tested in the latest browsers as well as IE11.

## Gulp tasks

Gulp task | Description | Watch version
---|---|---
`gulp build` | Builds `aria.custom.js`. This is the main task you'll use. | (none)
`gulp js` | Creates `aria.js` from the source files in `./src/`. | `gulp js:watch`
`gulp plugins` | Creates the plugins from their source files in `./plugins/src/` | `gulp plugins:watch`
`gulp test` | Runs the unit tests for `aria.js`. You will need to run `gulp js` first. | `gulp test:watch`
`gulp watch` | Runs `gulp js:watch`, `gulp plugins:watch` and `gulp test:watch` | (none)

## State of this library

This library is currently in **alpha** as I'm still working out the finer details. Here's my to-do list:

- [x] Browser test (IE11+).
- [x] Get the `aria` property working.
- [x] Finish writing unit tests. (Except for the non-`Proxy` fall-back of `delete` which doesn't work and I don't know why - see [issue 5](https://github.com/Skateside/ariajs/issues/5).)
- [x] Write some plugins for proprietary attributes and extended roles.
- [x] Write documentation in the WIKI.
- [ ] Release for beta testing.
- [ ] Write some widgets using this library to test feasibility?
