# ARIA.js

A helper library for working with WAI-ARIA attributes, designed to make manipulating them as simple as possible.

## How to use the library

The library optionally adds a new property to all elements: `aria`, containing properties for all WAI-ARIA attributes.

- Set attributes quickly and logically.

  ```js
  // <div id="div-1">
  document.getElementById("div-1").aria.label = "Just testing";
  // <div id="div-1" aria-label="Just testing">

  // <div id="div-2">
  document.getElementById("div-2").aria.checked = true;
  // <div id="div-2" aria-checked="true">

  // <div id="div-3-1">
  // <div id="div-3-2">
  document.getElementById("div-3-1").aria.controls = document.getElementById("div-3-2");
  // <div id="div-3-1" aria-controls="div-3-2">
  // <div id="div-3-2">
  ```

- White-list valid tokens and see warnings when trying to set different values (warnings can be disabled by setting a property on the global `ARIA` variable).

  ```js
  // <div id="div-4">
  document.getElementById("div-4").aria.live = "probably";
  // <div id="div-4">
  // warns: "aria.js: 'probably' is not a valid token for the 'aria-live' attribute"
  ```

- Get sensible values from the properties.

  ```js
  // <div id="div-5" aria-placeholder="Hello world">
  document.getElementById("div-5").aria.placeholder;
  // -> "Hello world"

  // <div id="div-6" aria-busy="true">
  document.getElementById("div-6").aria.busy;
  // -> true

  // <div id="div-7-1">
  // <div id="div-7-2" aria-activedescendant="div-7-1">
  document.getElementById("div-7-2").aria.activedescendant;
  // -> <div id="div-7-1">

  // <div id="div-8-1" aria-flowto="div-8-2">
  // <div id="div-8-2">
  document.getElementById("div-8-1").aria.flowto;
  // -> [<div id="div-8-2">]
  ```

- Remove the attributes easily.

  ```js
  // <div id="div-9" aria-modal="true">
  document.getElementById("div-9").aria.modal = "";
  // <div id="div-9">

  // <div id="div-10" aria-pressed="mixed">
  delete document.getElementById("div-10").aria.pressed;
  // <div id="div-10">
  ```

  **aria.js** uses the ES6 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) function to listen for the `delete` operator and adds a `setTimeout`-based fallback for browsers that don't understand `Proxy`. As a result, older browsers will asynchronously remove properties with the `delete` operator. In all browsers, setting the property to an empty string (`""`) will remove the attribute instantly.

- Get and set roles with ease, a bit like a DOM Level 1 attribute (e.g. `id` or `className`).

  ```js
  // <div id="div-11">
  document.getElementById("div-11").role = "button";
  // <div id="div-11" role="button">
  document.getElementById("div-11").role;
  // -> ["button"]
  ```

- Enjoy some utility functions added to a global `ARIA` variable.

  ```js
  // <div id="div-12">
  ARIA.makeFocusable(document.getElementById("div-12"));
  // <div id="div-12" tabindex="-1">

  // <div id="div-13">
  // <div class="div-14">
  ARIA.identify(document.getElementById("div-13"));
  // -> "div-13"
  ARIA.identify(document.querySelector(".div-14"));
  // -> "anonymous-element-0"
  // <div class="div-14" id="anonymous-element-0">

  ARIA.normalise("selected");
  // -> "aria-selected"
  ARIA.normalise("aria-haspopup");
  // -> "aria-haspopup"
  ```

  `ARIA.normalise` has the alias `ARIA.normalize` to assist developers who know/prefer American English. The two methods are completely interchangeable - updating one will automatically change the other.

- Work without the `aria` property by using an alternative interface - perfect for third-party libraries which don't control the environment.

  ```js
  // <div id="div-15" aria-valuenow="10">
  var element = new ARIA.Element(document.getElementById("div-15"));
  element.valuenow;
  // -> 10
  element.required = true;
  // <div id="div-15" aria-valuenow="10" aria-required="true">
  ```

## State of this library

This library is currently in **alpha** as I'm still working out the finer details. Here's my to-do list:

- [x] Browser test (IE11+).
- [x] Get the `aria` property working.
- [x] Get the `role` property working.
- [x] Finish writing unit tests.
- [ ] Write documentation in the WIKI.
- [ ] Write some plugins for proprietary attributes and extended roles.
- [ ] Release for beta testing.
- [ ] Write some widgets using this library to test feasibility?
