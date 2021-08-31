# Plugins

Aria.js is a simple library, designed to have a small filesize and simple interface, but it's also designed to be easily modified. This allows Aria.js to be extended using plugins, adding or replacing functionality.

---
- [Overview](overview.md)
- [Property types](types.md)
- [Utilities](utilities.md)
- **Plugins**
- [Gulp tasks](gulp.md)
---

## Creating a Plugin

The `Aria` variable is an object and can be extended by overriding methods. It's good practice to wrap the plugin in an [IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) and check to make sure the global `Aria` variable references Aria.js.

For example, here is a plugin that creates the **non-standard** [`x-ms-aria-flowfrom`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/x-ms-aria-flowfrom) attribute and manages it like a reference.

```js
(function (Aria) {

    "use strict";

    if (!Aria || !Aria.VERSION) {
        return;
    }

    Aria.addProperty("flowfrom", Aria.types.reference, "x-ms-aria-flowfrom");

}(window.Aria));
```

## Existing Plugins

There are a few pre-built plugins which you can chose to add if you like:

- [Extend Node](#extend-node-plugin)
- [jQuery](#jquery-plugin)
- [Proxy](#proxy-plugin)
- [Tokens](#tokens-plugin)

### Extend Node Plugin

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

### jQuery Plugin

The `jquery` plugin creates a jQuery plugin, adding `aria`, `role`, `removeRole` and `identify` methods. The `aria` method is based on [`$().attr()`](https://api.jquery.com/attr/) and so it has a few signatures:

- `$().aria("property")` returns the value of the property of the first element.
- `$().aria("property", value)` sets the value of the property to the given value for all elements. It returns the instance to allow for chaining. Value can be a string to set the value, null or an empty string to remove the attribute, or a function to derive the value to set.
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

jQbutton.aria("label", function (element, index, attributeValue) {

    return (
        "A button controlling "
        + jQbutton.aria("controls").length
        + " element(s)"
    );

});
// <button
//     type="button"
//     aria-controls="ariajs-0"
//     aria-expanded="true"
//     aria-label="A button controlling 1 element(s)"
// ></button>
// <div id="ariajs-0"></div>
```

Roles can be managed using `$().role()` and `$().removeRole()`.

```js
// <div></div>
var jQdiv = $("div");

jQdiv.role("button heading");
// <div role="button heading"></div>
jQdiv.removeRole("button");
// <div role="heading"></div>
jQdiv.removeRole();
// <div></div>
```

Elements can be identified using `$().identify()`. Only the first element in the collection will be modified.

```js
// <div></div>
var jQdiv = $("div");

jQdiv.identify(); // -> "ariajs-0"
// <div id="ariajs-0"></div>
```

### Proxy Plugin

The `proxy` plugin takes advantage of `Proxy` and allows properties to be deleted using the `delete` keyword. The properties for the `Aria` instance can ignore a `aria-` prefix as well.

```html
<button aria-expanded="true">Button</button>

<script>
var button = document.querySelector("button");
var aria = new Aria(button);
delete aria.expanded;
// <button>Button</button>

var label = "aria-label";
aria[label] = "testing";
// <button aria-label="testing">Button</button>
aria[label]; // -> "testing"
aria.label; // -> "testing"
</script>
```

This is an optional plugin because the environment may not have `Proxy` and the delete trap cannot be polyfilled.

### Tokens Plugin

WAI-ARIA attributes can be a "token" or a "token list" - attributes that only allow certain values. By default, Aria.js doesn't validate the values and just allows the developer to enter any value they live. The `tokens` plugin prevents invalid entries from being added. If the developer tries, a warning will be added to the console and the value will not be added. **Be warned** that passing an invalid token can cause the library to remove the attribute.

```js
var div = document.querySelector("div");
var aria = new Aria(div);

aria.autocomplete = "inline";
// <div aria-orientation="inline"></div>

aria.autocomplete = "abc";
// Warns:
// Aria.js: The aria-autocomplete attribute can not accept the value "abc"
// <div></div>
```

For token lists, each entry is validated and only the invalid entries are removed. Again, be aware that if all entries are invalid then the attribute will be removed.

```js
aria.role = "button abc heading";
// Warns:
// Aria.js: The role attribute can not accept the value "abc"
// <div role="button heading"></div>
```

The plugin also adds two new types to handle some of the new token lists.

The `tokenState` type allows `true`, `false` or one of the valid values to be set. If the value is unset or unrecognised, `false` is returned. This affects `aria-current`, `aria-haspopup`, and `aria-invalid`.

```js
var div = document.querySelector("div");
var aria = new Aria(div);

aria.current = true;
// <div aria-current="true"></div>
aria.current; // -> true
aria.current = "page";
// <div aria-current="page"></div>
aria.current; // -> "page"

aria.current = "abc";
// Warns:
// Aria.js: The aria-current attribute can not accept the value "abc"
// <div></div>
aria.current; // -> false
```

The `tokenUndefined` type allows for `undefined` to be one of the values being set. If the value is unset or unrecognised, `undefined` is returned.

```js
var div = document.querySelector("div");
var aria = new Aria(div);

aria.orientation = undefined;
// <div aria-orientation="undefined"></div>
aria.orientation; // -> undefined
aria.orientation = "horizontal";
// <div aria-orientation="horizontal"></div>
aria.orientation; // -> "horizontal"

aria.orientation = "abc";
// Warns:
// Aria.js: The aria-orientation attribute can not accept the value "abc"
// <div></div>
aria.orientation; // -> undefined
```
