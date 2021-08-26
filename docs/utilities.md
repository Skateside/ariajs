# Utilities

Aria.js comes with a few utility methods.

---
- [Overview](overview.md)
- [Property types](types.md)
- **Utilities**
- [Plugins](plugins.md)
- [Gulp tasks](gulp.md)
---

There are 4 main utility functions and 1 property:

- [`Aria.VERSION`](#ariaversion)
- [`Aria.prefix()`](#ariaprefix)
- [`Aria.unprefix()`](#ariaunprefix)
- [`Aria.identify()`](#ariaidentify)
- [`Aria.addProperty()`](#ariaaddproperty)

Other properties are exposed and can be modified if necessary, but they're undocumented because they're mainly for modification or making Aria.js work - they may change at some point.

## `Aria.VERSION`

This returns the current version of Aria.js. The value cannot be changed. The value uses [semver](https://semver.org/).

```js
Aria.VERSION; // -> "1.0.0"
Aria.VERSION = "abc";
Aria.VERSION; // -> "1.0.0"
```

## `Aria.prefix()`

```js
/**
 * @param  {String} attribute
 *         Attribute to prefix.
 * @return {String}
 *         Prefixed attribute
 */
```

This method takes an attribute and makes sure it's prefixed with `aria-`. It won't modify an attribute that already has that prefix.

```js
Aria.prefix("label"); // -> "aria-label"
Aria.prefix("aria-label"); // -> "aria-label"
```

## `Aria.unprefix()`

```js
/**
 * @param  {String} attribute
 *         Attribute to unprefix.
 * @return {String}
 *         Unprefixed attribute
 */
```

This method takes an attribute and removes its `aria-` prefix. It won't modify an attribute that doesn't have that prefix.

```js
Aria.unprefix("aria-label"); // -> "label"
Aria.unprefix("label"); // -> "label"
```

## `Aria.identify()`

```js
/**
 * @param  {Element} element
 *         Element to identify.
 * @return {String}
 *         Element's ID.
 */
```

This method takes an element and returns its ID.

```js
// <div id="abc123"></div>
Aria.identify(document.querySelector("div")); // -> "abc123"
```

If the element doesn't have an ID, a unique one is generated and assigned before being returned.

```js
// <div></div>
Aria.identify(document.querySelector("div")); // -> "ariajs-0"
// <div id="ariajs-0"></div>
```

## `Aria.addProperty()`

```js
/**
 * @param {String} label
 *        The short form of the attribute.
 * @param {Object} type
 *        The property type for this attribute.
 * @param {String} [attributeName]
 *        Optional name for the attribute.
 */
```

This method allows you to add or replace an existing property. The `label` is the short form of the attribute - this is the property that you use when you check or set the attribute. The `type` is a [property types](types.md). The optional `attributeName` is the attribute that will be set - if it's ommitted, the `label` is passed through [`Aria.prefix()`](#aria-prefix) and the result is used.

As an example, this is how to add the **non-standard** [`x-ms-aria-flowfrom`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/x-ms-aria-flowfrom) attribute.

```js
Aria.addProperty(
    "flowfrom",
    Aria.types.reference,
    "x-ms-aria-flowfrom"
);
```

The property could now be used like any other Aria.js property.

```js
// <section></section>
// <article></article>

var aria = new Aria(document.querySelector("article");
aria.flowfrom = document.querySelector("section");

// <section id="ariajs-0"></section>
// <article x-ms-aria-flowfrom="ariajs-0"></article>

aria.flowfrom; // -> <section id="ariajs-0">
```
