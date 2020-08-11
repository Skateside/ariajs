# Types

Aria.js properties will be one of a few types.

---
- [Overview](overview.md)
- **Property types**
- [Plugins](plugins.md)
- [Gulp tasks](gulp.md)
---


There are 9 types that Aria.js understands:

- [Basic](#basic-type)
- [Float](#float-type)
- [Integer](#integer-type)
- [State](#state-type)
- [Tristate](#tristate-type)
- [Undefined State](#undefined-state-type)
- [Reference](#reference-type)
- [List](#list-type)
- [Reference List](#reference-list-type)

## Basic Type

The basic type is a simple string. The value won't be modified (other than coercing it into a string). If the attribute isn't set, an empty string is returned.

Here are the properties that use the basic type:

- `autocomplete`
- `current`
- `haspopup`
- `invalid`
- `keyshortcuts`
- `label`
- `live`
- `orientation`
- `placeholder`
- `roledescription`
- `sort`
- `valuetext`

### Example

```js
// <div id="basic"></div>
var aria = new Aria(document.getElementById("basic"));

// No attribute set yet:
aria.label; // -> ""
// Setting a value:
aria.label = "Lorem ipsum";
// <div id="basic" aria-label="Lorem ipsum"></div>
// Getting a value:
aria.label; // -> "Lorem ipsum"
```

## Float Type

The float type will coerce any given value into a number, it will also return a number. If the value being set isn't numeric, the attribute will be remove. If the attribute isn't set, 0 is returned.

Here are the properties that use the float type:

- `valuemax`
- `valuemin`
- `valuenow`

### Example

```js
// <div id="float"></div>
var aria = new Aria(document.getElementById("float"));

// No attribute set yet:
aria.valuenow; // -> 0
// Setting a value:
aria.valuenow = 123.45;
// <div id="float" aria-valuenow="123.45"></div>
// Getting a value:
aria.valuenow; // -> 123.45
// Setting a non-numeric value removes the attribute.
aria.valuenow = "abc";
// <div id="float"></div>
```

## Integer Type

The integer type is identical to the [float type](#float-type) except that the integer type will drop the value's decimal.

Here are the properties that use the integer type.

- `colcount`
- `colindex`
- `colspan`
- `level`
- `posinset`
- `rowcount`
- `rowindex`
- `rowspan`
- `setsize`

### Example

```js
// <div id="integer"></div>
var aria = new Aria(document.getElementById("integer"));

// No attribute set yet:
aria.level; // -> 0
// Setting a value:
aria.level = 1;
// <div id="integer" aria-level="1"></div>
// Getting a value:
aria.level; // -> 1
// Setting a decimal value
aria.level = 2.3;
// <div id="integer" aria-level="2"></div>
```

## State Type

The state type only understands `true` and `false`, although the string versions can be used as well, such as `"true"` and `"false"`. If the attribute isn't set, false is returned.

Here are the properties that use the state type.

- `atomic`
- `busy`
- `disabled`
- `modal`
- `multiline`
- `multiselectable`
- `readonly`
- `required`

### Example

```js
// <div id="state"></div>
var aria = new Aria(document.getElementById("state"));

// No attribute set yet:
aria.atomic; // -> false
// Setting a value:
aria.atomic = true;
// <div id="state" aria-atomic="true"></div>
// Getting a value:
aria.atomic; // -> true
```

## Tristate Type

A tristate is the same as the [state type](#state-type), except that is allows the value "mixed". Just like the state type, it will return false if the attribute isn't set.

Here are the properties that use the tristate type.

- `checked`
- `pressed`

### Example

```js
// <div id="tristate"></div>
var aria = new Aria(document.getElementById("tristate"));

// No attribute set yet:
aria.checked; // -> false
// Setting a value:
aria.checked = "mixed";
// <div id="tristate" aria-checked="mixed"></div>
// Getting a value:
aria.checked; // -> "mixed"
```

## Undefined State Type

The undefined state works the same as the [state type](#state-type) except that it allows the value undefined and it returns undefined if the attribute isn't set.

Here are the properties that use the undefined state type.

- `expanded`
- `grabbed`
- `hidden`
- `selected`

### Example

```js
// <div id="undefinedstate"></div>
var aria = new Aria(document.getElementById("undefinedstate"));

// No attribute set yet:
aria.expanded; // -> undefined
// Setting a value:
aria.expanded = true;
// <div id="undefinedstate" aria-expanded="true"></div>
// Getting a value:
aria.expanded; // -> true
```

## Reference Type

The reference type sets or retrieves an element. When setting the property, a unique ID will be generated for the element. If the attribute isn't set, the property returns null. It also returns null if the ID isn't recognised.

Here are the properties that use the reference type:

- `activedescendant`
- `details`
- `errormessage`

### Example

```js
// <div id="reference"></div>
// <article></article>
var aria = new Aria(document.getElementById("reference"));
var article = document.querySelector("article");

aria.details; // -> null
aria.details = article;
// <div id="reference" aria-details="arisja-0"></div>
// <article id="ariajs-0"></article>
aria.details; // -> <article id="ariajs-0"></article>
```

## List Type

The list type can take either a space-separated list or an array of values (or an array-like structure). Each value is passed through the [basic type](#basic-type) to correctly coerce them. It will return an empty array if the attribute isn't set. You can also remove the attribute by setting the property to either an empty string or an empty array.

Be aware that modifying the array returned by the property will not effect the attribute value.

Here are the properties that use the list type:

- `dropeffect`
- `relevant`
- `role` (Unlike most properties, this creates the attribute "role" instead of "aria-role".)

### Example

```js
// <div id="list"></div>
var aria = new Aria(document.getElementById("list"));

aria.dropeffect; // -> []
aria.dropeffect = "copy";
// <div id="list" aria-dropeffect="copy"></div>
aria.dropeffect; // -> ["copy"]
```

## Reference List Type

The reference list type is the same as the [list type](#list-type) except that the values are passed through the [reference type](#reference-list).

Here are the properties that use the reference list type:

- `controls`
- `describedby`
- `flowto`
- `labelledby`
- `owns`

### Example

```js
// <div id="reference-list"></div>
// <article></article>
var aria = new Aria(document.getElementById("reference-list"));
var article = document.querySelector("article");

aria.controls; // -> []
aria.controls = article;
// <div id="reference-list" aria-controls="arisja-0"></div>
// <article id="ariajs-0"></article>
aria.controls; // -> [<article id="ariajs-0"></article>]
```
