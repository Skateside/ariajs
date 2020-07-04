# Aria.js

A helper library for working with WAI-ARIA attributes, designed to make manipulating them as simple as possible.

## How it Works

1. Pass an element to the `Aria` function.

    ```js
    // <button type="button">Click me</button>
    var button = document.querySelector("button");
    var aria = new Aria(button);
    ```

    (You can use the [extend-node plugin](docs/plugins.md#extend-node-plugin.md) to skip this step.)

2. Your new `aria` object will help manage the WAI-ARIA attributes.

    ```js
    aria.label = "Lorem ipsum";
    // <button type="button"
    //      aria-label="Lorem ipsum">Click me</button>
    aria.valuenow = 12;
    // <button type="button"
    //      aria-label="Lorem ipsum"
    //      aria-valuenow="21">Click me</button>
    aria.controls = document.querySelector("div");
    // <button type="button"
    //      aria-label="Lorem ipsum"
    //      aria-valuenow="21"
    //      aria-controls="ariajs-0">Click me</button>
    // <div id="aria-js"></div>
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
- [Plugins](docs/plugins.md)
- [Gulps tasks](docs/gulp.md)

## Building Aria.js

Aria.js uses [gulp](#) to compile. You can use the `js` command to compile the files:

```bash
$ gulp js
```

You can also compile plugins or concatenate plugins with the overall file - check [the gulp documentation](docs/gulp.md) or [the plugin notes](docs/plugins.md) for full details.

## Browser Support

Aria.js works in all modern browsers, but it may need some polyfills for older browsers. Specifically, you may need to polyfill these methods:

- `Object.assign`
- `Object.entries`
- `Array.from`
- `String.prototype.startsWith`
- `Number.isNaN`
- `Proxy`

You can avoid the `Proxy` polyfill using [the no-proxy plugin](docs/plugins.md#no-proxy-plugin), which can be handy because some `Proxy` ployfills will throw an error when using the delete property trap (which Aria.js does).
