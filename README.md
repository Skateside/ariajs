# ARIA.js

A helper library for working with WAI-ARIA attributes.

## How it works

This library adds a new property to all elements: `aria`. The `aria` properties contains placeholders for all the current WAI-ARIA attributes (and future attributes can be easily added).

### Let's see some code

Got an error message and need to link it to the element?

```html
<label for="my-name">Please enter something</label>
<input name="my-name" id="my-name">
<span class="error">Please enter a swankier something.</span>
```

**aria.js** allows you to simply link those elements.

```js
var input = document.getElementById("my-name");
var error = document.querySelector(".error");
input.aria.errormessage = error;
```

The library updates the markup like this:

```html
<label for="my-name">Please enter something</label>
<input name="my-name" id="my-name" aria-errormessage="anonymous-element-0">
<span class="error" id="anonymous-element-0">Please enter a swankier something.</span>
```

You can easily access information about the WAI-ARIA attribute.

```js
input.aria.errormessage.get(); // -> <span class="error" id="anonymous-element-0">
input.aria.errormessage.getAttribute(); // -> "anonymous-element-0"
```

### More complicated attributes

The `aria-controls` attribute can handle an ID reference list. Want a button that controls 2 elements? No problem.

```html
<button type="button">Button!</button>
<div>Element 1</div>
<div>Element 2</div>
<section id="abc">Element 3</section>
```

**aria.js** has you covered:

```js
var button = document.querySelector("button");
var divs = document.querySelectorAll("div");
button.aria.controls = divs;
```

```html
<button type="button" aria-controls="anonymous-element-1 anonymous-element-2">Button!</button>
<div id="anonymous-element-1">Element 1</div>
<div id="anonymous-element-2">Element 2</div>
<section id="abc">Element 3</section>
```

From there you can check the length, get the elements or even manage the attribute value by ID value or just the element itself.

```js
button.aria.controls.length; // -> 2
button.aria.controls.get(); // -> [<div id="anonymous-element-1">, <div id="anonymous-element-2">]
button.aria.controls.remove(document.querySelector("div"));
button.aria.controls.length; // -> 1
button.aria.controls.get(); // -> [<div id="anonymous-element-2">]
button.aria.controls.add("abc123");
button.aria.controls.length; // -> 2
button.aria.controls.get(); // -> [<div id="anonymous-element-2">, <section id="abc123">]
```

## State of this library

This library is currently in **alpha** as unit tests are still being written.

- [ ] Finish writing unit tests.
- [ ] Browser test (IE11+).
- [ ] Write documentation.
- [ ] Release for beta testing.
