# Aria.js

```js
// Aria.js and its extend-node plugin:
button.aria.controls = div;
```

Aria.js is a helper library for working with WAI-ARIA attributes, designed to make manipulating them as easy as possible. It's designed to be both simple and small, weighing less than 2KB when minified and gzipped.

## How it Works

1. Pass an element to the `Aria` function.

    ```js
    // <button type="button">Click me</button>
    // <div></div>
    var button = document.querySelector("button");
    var aria = new Aria(button);
    ```

    (You can use the [extend-node plugin](docs/plugins.md#extend-node-plugin) to skip this step.)

2. Your new `aria` object will help manage the WAI-ARIA attributes.

    ```js
    aria.label = "Lorem ipsum";
    // <button type="button"
    //      aria-label="Lorem ipsum">Click me</button>
    // <div></div>
    aria.valuenow = 12;
    // <button type="button"
    //      aria-label="Lorem ipsum"
    //      aria-valuenow="21">Click me</button>
    // <div></div>
    aria.controls = document.querySelector("div");
    // <button type="button"
    //      aria-label="Lorem ipsum"
    //      aria-valuenow="21"
    //      aria-controls="ariajs-0">Click me</button>
    // <div id="ariajs-0"></div>
    ```

    You can access these properties to get useful values, rather than simply strings.

    ```js
    aria.label; // -> "Lorem ipsum"
    aria.valuenow; // -> 12
    aria.controls; // -> [<div id="ariajs-0">]
    ```

You can see all the options in the documentation.

## Documentation

The documentation for this library can be found in [the docs](docs/overview.md). The documentation is broken down into a few pages:

- [Overview](docs/overview.md)
- [Property types](docs/types.md)
- [Utilities](docs/utilities.md)
- [Plugins](docs/plugins.md)
- [Gulps tasks](docs/gulp.md)

## Browser Support

Aria.js works in all modern browsers but has been written in ES5 so it can work in older browsers without the need for transpiling (and increasing the file size). If you wish to use Aria.js in an older browser, you may need to polyfill these methods:

- `Object.assign`
- `Object.entries`
- `Array.from`
- `String.prototype.startsWith`
- `Number.isNaN`
