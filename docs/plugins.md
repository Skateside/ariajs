# Plugins

Aria.js is a simple library, designed to have a small filesize and simple interface, but it's also designed to be easily modified. This allows Aria.js to be extended using plugins, adding or replacing functionality.

---
- [Overview](overview.md)
- [Property types](types.md)
- **Plugins**
- [Gulp tasks](gulp.md)
---


There are a few pre-built plugins which you can chose to add if you like:

- [Extend Node](#extend-node-plugin)
- [jQuery](#jquery-plugin)
- [No Proxy](#no-proxy-plugin)
- [Tokens](#tokens-plugin)

## Extend Node Plugin

The `extend-node` plugin automatically adds an "aria" property to all elements, which is the equivalent of passing that element to the `Aria` constructor. Some behind-the-scenes trickery only creates the `Aria` instance when it's first called to save on processing power.

For example:

```js
// <button type="button"></button>
// <div></div>
var button = document.querySelector("button");
var content = document.querySelector("div");

button.aria.controls = content;
button.aria.expanded = !content.hidden;
// <button
//     type="button"
//     aria-controls="ariajs-0"
//     aria-expanded="true"
// ></button>
// <div id="ariajs-0"></div>
```

It also creates a short-cut for the `role` attribute.

```js
// <button type="button"></button>
var button = document.querySelector("button");
button.role = "button";
// <button type="button" role="button"></button>
button.role; // -> ["button"]
```

## jQuery Plugin

The `jquery` plugin creates a jQuery plugin for an `aria` and `role` method. The `aria` method has a few signatures:

- `$().aria("property")` returns the value of the property of the first element.
- `$().aria("property", value)` sets the value of the property to the given value for all elements. It returns the instance to allow for chaining.
- `$().aria(properties)` takes an object of properties and their values and sets them on all elements. It returns the instance to allow for chaining.

For reference types or a reference list type, a jQuery object will be understood. Those properties also return a jQuery object of the results.

```js
// <button type="button"></button>
// <div></div>
var jQbutton = $("button");
var jQcontent = $("div");

jQbutton.aria({
    controls: jQcontent,
    expanded: !jQcontent.prop("hidden")
})
// <button
//     type="button"
//     aria-controls="ariajs-0"
//     aria-expanded="true"
// ></button>
// <div id="ariajs-0"></div>

jQbutton.aria("controls"); // -> jQuery[<div id="ariajs-0"></div>]
```

## No Proxy Plugin

Aria.js relies on `Proxy` but older browsers don't understand it. Polyfills tend to throw an error if the `deleteProperty` trap is used, which Aria.js does. To get around that, the `no-proxy` plugin replaces the functionality that uses it with `Object.defineProperty`, at the cost of the `delete` keyword not working.

## Tokens Plugin

WAI-ARIA attributes can be a "token" or a "token list" - attributes that only allow certain values. By default, Aria.js doesn't validate the values and just allows the developer to enter any value they live. The `tokens` plugin prevents invalid entries from being added. If the developer tries, a warning will be added to the console and the value will not be added. **Be warned** that passing an invalid token can cause the library to remove the attribute.

```js
var div = document.querySelector("div");
var aria = new Aria(div);

aria.orientation = undefined;
// <div aria-orientation="undefined"></div>

aria.orientation = "abc";
// Warns:
// Aria.js: The aria-orientation attribute can not accept the value "abc"
// <div></div>
```

For token lists, each entry is validated and only the invalid entries are removed. Again, be aware that if all entries are invalid then the attribute will be removed.

```js
aria.role = "button abc heading";
// Warns:
// Aria.js: The role attribute can not accept the value "abc"
// <div role="button heading"></div>
```
