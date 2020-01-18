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
document.querySelectorAll(".disclosure").forEach((disclosure) => {

    let button = disclosure.querySelector("button");
    let content = disclosure.querySelector("div");

    button.addEventListener("click", () => {
        div.hidden = !div.hidden;
    });

});
```

**Aria.js** will simplify the process of adding and maintaining the WAI-ARIA attributes.

```js
document.querySelectorAll(".disclosure").forEach((disclosure) => {

    let button = disclosure.querySelector("button");
    let content = disclosure.querySelector("div");

    button.aria = new Aria(button); // There's a plugin to do this automatically.
    button.aria.controls = content;
    button.aria.expanded = !content.hidden;

    button.addEventListener("click", () => {
        content.hidden = !content.hidden;
        button.aria.expanded = !content.hidden;
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

## Building

ARIA.js uses webpack to compile the files. There are 4 commands that you can use:

- `yarn build` builds the production (minified) version of aria.js in `dist/aria.js`.
- `yarn build-dev` builds the development version of aria.js in `dist/aria.js` and includes a sourcemap in `dist/aria.js.map`.
- `yarn test` runs the unit tests.
- `yarn test-build` is a short-cut for running `yarn build-dev` followed by `yarn test` - this allows the latest version of the compiled files to be tested.

## Browser Support

ARIA.js will require some polyfills to work in IE11:

- [`CustomEvent`](https://www.npmjs.com/package/custom-event-polyfill)
- [`Number.isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN#Polyfill)
- [`Proxy`](https://www.npmjs.com/package/es6-proxy-polyfill) (note that ARIA.js uses Proxy's `deleteProperty` trap which can rarely be polyfilled)
- [`Symbol`](https://github.com/rousan/symbol-es6)

Because this uses some features that are difficult to polyfill correctly, **ARIA.js is not guaranteed to work fully in IE11**.
