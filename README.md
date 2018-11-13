# ARIA.js

A helper library for working with WAI-ARIA attributes, designed to make manipulating them as simple as possible.

## How to use the library

The library optionally adds a new property to all elements: `aria`, containing properties for all WAI-ARIA attributes.

- Set attributes quickly and logically.

  ```js
  // <div id="set-1">
  document.getElementById("set-1").aria.label = "Just testing";
  // <div id="set-1" aria-label="Just testing">

  // <div id="set-2">
  document.getElementById("set-2").aria.checked = true;
  // <div id="set-2" aria-checked="true">

  // <div id="set-3-1">
  // <div id="set-3-2">
  document.getElementById("set-3-1").aria.controls = document.getElementById("set-3-2");
  // <div id="set-3-1" aria-controls="set-3-2">
  // <div id="set-3-2">
  ```

- White-list valid tokens and see warnings when trying to set different values (warnings can be disabled by setting a property on the global `ARIA` variable).

  ```js
  // <div id="white-list-1">
  document.getElementById("white-list-1").aria.live = "probably";
  // <div id="white-list-1">
  // warns: "aria.js: 'probably' is not a valid token for the 'aria-live' attribute"
  ```

- Get sensible values from the properties.

  ```js
  // <div id="get-1" aria-placeholder="Hello world">
  document.getElementById("get-1").aria.placeholder;
  // -> "Hello world"

  // <div id="get-2" aria-busy="true">
  document.getElementById("get-2").aria.busy;
  // -> true

  // <div id="get-3">
  // <div id="get-4" aria-activedescendant="get-3">
  document.getElementById("get-4").aria.activedescendant;
  // -> <div id="get-3">

  // <div id="get-5" aria-flowto="get-6">
  // <div id="get-6">
  document.getElementById("get-5").aria.flowto;
  // -> [<div id="get-6">]
  ```

- Remove the attributes easily.

  ```js
  // <div id="remove-1" aria-modal="true">
  document.getElementById("remove-1").aria.modal = "";
  // <div id="remove-1">

  // <div id="remove-2" aria-pressed="mixed">
  delete document.getElementById("remove-2").aria.pressed;
  // <div id="remove-2">
  ```

  **aria.js** uses the ES6 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) function to listen for the `delete` operator and adds a `setTimeout`-based fallback for browsers that don't understand `Proxy`. As a result, older browsers will asynchronously remove properties with the `delete` operator. In all browsers, setting the property to an empty string (`""`) will remove the attribute instantly.

- Get and set roles with ease, with validation included.

  ```js
  // <div id="role-1">
  document.getElementById("role-1").role = "button";
  // <div id="role-1" role="button">
  document.getElementById("role-1").role;
  // -> ["button"]
  ```

- Enjoy some utility functions added to a global `ARIA` variable.

  ```js
  // <div id="util-1">
  // <div class="util-2">
  ARIA.identify(document.getElementById("util-1"));
  // -> "util-1"
  ARIA.identify(document.querySelector(".util-2"));
  // -> "anonymous-element-0"
  // <div class="util-2" id="anonymous-element-0">

  ARIA.normalise("selected");
  // -> "aria-selected"
  ARIA.normalise("aria-haspopup");
  // -> "aria-haspopup"
  ```

  `ARIA.normalise` has the alias `ARIA.normalize` to assist developers who know/prefer American English. The two methods are completely interchangeable - updating one will automatically change the other.

- Work without the `aria` property by using an alternative interface - perfect for third-party libraries which don't control the environment.

  ```js
  // <div id="interface-1" aria-valuenow="10">
  var element = new ARIA.Element(document.getElementById("interface-1"));
  element.valuenow;
  // -> 10
  element.required = true;
  // <div id="interface-1" aria-valuenow="10" aria-required="true">
  ```

## State of this library

This library is currently in **alpha** as I'm still working out the finer details. Here's my to-do list:

- [x] Browser test (IE11+).
- [x] Get the `aria` property working.
- [x] Finish writing unit tests. (Except for the non-`Proxy` fall-back of `delete` which doesn't work and I don't know why.)
- [ ] Write documentation in the WIKI.
- [x] Write some plugins for proprietary attributes and extended roles.
- [ ] Release for beta testing.
- [ ] Write some widgets using this library to test feasibility?
