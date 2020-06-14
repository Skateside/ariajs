# ARIA.js

A helper library for working with WAI-ARIA attributes, designed to make manipulating them as simple as possible.

## Usage

Imagine you're creating a disclosure widget (even though [`<details>`/`<summary>` is the better solution](https://css-tricks.com/quick-reminder-that-details-summary-is-the-easiest-way-ever-to-make-an-accordion/)). The markup will be very basic.

```html
<div class="disclosure">
    <button type="button">Toggle</button>
    <div>
        <p>Content</p>
    </div>
</div>
```

The functionality is also very easy to write.

```js
document.querySelectorAll(".disclosure").forEach(function (disclosure) {

    var button = disclosure.querySelector("button");
    var content = disclosure.querySelector("div");

    button.addEventListener("click", function () {
        div.hidden = !div.hidden;
    });

});
```

**Aria.js** will simplify the process of adding and maintaining the WAI-ARIA attributes.

```js
document.querySelectorAll(".disclosure").forEach(function (disclosure) {

    var button = disclosure.querySelector("button");
    var content = disclosure.querySelector("div");
    var aria = new Aria(button);

    aria.controls = content;
    aria.expanded = !content.hidden;

    button.addEventListener("click", function () {
        content.hidden = !content.hidden;
        aria.expanded = !content.hidden;
    });

});
```

The markup has now been updated:

```html
<div class="disclosure">
    <button type="button" aria-controls="aria-element-0" aria-expanded="true">Toggle</button>
    <div id="aria-element-0">
        <p>Content</p>
    </div>
</div>
```

## Documentation

The documentation for this library can be found in [the Wiki](https://github.com/Skateside/ariajs/wiki).

_NOTE: the documentation is for the old version of the library!_

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

## Unit Test Troubleshooting

PhantomJS currently doesn't understand `Proxy`, which AriaJS uses. If you run `gulp test`, you may see this error:

> Can't find variable: Proxy

This will happen because the no-proxy plugin hasn't been loaded. Run `gulp plugins` to make sure the file has been written, then `gulp test` will work correctly.

---

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

## Gulp tasks

Gulp task | Description | Watch version
---|---|---
`gulp build` | Builds `aria.custom.js`. This is the main task you'll use. | (none)
`gulp js` | Creates `aria.js` from the source files in `./src/`. | `gulp js:watch`
`gulp plugins` | Creates the plugins from their source files in `./plugins/src/` | `gulp plugins:watch`
`gulp test` | Runs the unit tests for `aria.js`. You will need to run `gulp js` first. | `gulp test:watch`
`gulp watch` | Runs `gulp js:watch`, `gulp plugins:watch` and `gulp test:watch` | (none)
