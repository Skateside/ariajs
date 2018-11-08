# ARIA.js

A helper library for working with WAI-ARIA attributes, designed to make working with WAI-ARIA attributes as simple as working with any other JavaScript object.

## How it works

This library adds a new property to all elements: `aria`. The `aria` properties contains placeholders for all the current WAI-ARIA attributes (and future attributes can be easily added).

### Let's see some code

Got a checkbox you'd like to improve with WAI-ARIA attributes?

```html
<span class="checkbox">
    <input type="checkbox" class="checkbox__input" checked>
    <span class="checkbox__render"></span>
</span>
```

**aria.js** allows you to simply work with the element.

```js
var checkbox = document.querySelector(".checkbox__input");
var render = document.querySelector(".checkbox__render");
render.aria.checked = checkbox.checked;
```

The library updates the markup like this:

```html
<span class="checkbox">
    <input type="checkbox" class="checkbox__input" checked>
    <span class="checkbox__render" aria-checked="true"></span>
</span>
```

**aria.js** will return the type of variable you're expecting. In this case, the boolean value `true`.

```js
render.aria.checked; // -> true
```

Perhaps you need to flag that the checkbox is indeterminate?

```js
render.aria.checked = "mixed";
```

The markup would now look like this:

```html
<span class="checkbox">
    <input type="checkbox" class="checkbox__input" checked>
    <span class="checkbox__render" aria-checked="mixed"></span>
</span>
```

... and the property still gives a useful value.

```js
render.aria.checked; // -> "mixed"
```

### What about working with element references?

The `aria-controls` attribute can handle an ID reference list. Want a button that controls 2 elements? No problem!

```html
<button type="button">Button!</button>
<div>Element 1</div>
<div>Element 2</div>
<section id="abc">Element 3</section>
```

With **aria.ja** you can simply pass one or more elements to the property and the attribute value will be a space-separated list of the element IDs. If any of the elements are missing an ID, a unique one is automatically generated and assigned.

As a developer, you just need to write a a single line of code.

```js
var button = document.querySelector("button");
var divs = document.querySelectorAll("div");
button.aria.controls = divs;
```

**aria.js** will get the element IDs (generating them first in this case) and populate the attribute for you.

```html
<button type="button" aria-controls="anonymous-element-1 anonymous-element-2">Button!</button>
<div id="anonymous-element-1">Element 1</div>
<div id="anonymous-element-2">Element 2</div>
<section id="abc">Element 3</section>
```

Since the attribute is a reference list, **aria.js** will return an array of elements.

```js
button.aria.controls; // -> [<div id="anonymous-element-1">, <div id="anonymous-element-2">]
```

### Want to remove an attribute?

If you have an element with a WAI-ARIA attribute you don't need, just `delete` it.

```html
<p id="text" aria-label="Some text">Some text</p>
```

```js
var text = document.getElementById("text");
delete text.aria.label;
```

```html
<p id="text">Some text</p>
```

**aria.js** uses the ES6 function [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) to listen for developers using `delete` and contains a fallback for older browsers (such as IE11).

## State of this library

This library is currently in **alpha** as unit tests are still being written.

- [x] Browser test (IE11+).
- [ ] Get the `aria` property working.
- [ ] Get the `role` property working.
- [x] Finish writing unit tests.
- [ ] Write documentation.
- [ ] Release for beta testing.
