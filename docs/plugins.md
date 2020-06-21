# Plugins

Aria.js is a simple library, designed to have a small filesize and simple interface, but it's also designed to be easily modified. This allows Aria.js to be extended using plugins, adding or replacing functionality.

There are a few pre-built plugins which you can chose to add if you like:

- [Extend Node](#extend-node-plugin)
- [jQuery](#jquery-plugin)
- [No Proxy](#no-proxy-plugin)

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
button.role; // -> ["role"]
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
