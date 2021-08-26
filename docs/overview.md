# Overview

Working with WAI-ARIA attributes isn't complicated, but Aria.js will make it even easier.

---
- **Overview**
- [Property types](types.md)
- [Utilities](utilities.md)
- [Plugins](plugins.md)
- [Gulp tasks](gulp.md)
---

For example, consider a simple disclose widget: a button that toggles a related div's visibility.

```html
<div class="disclose">
    <button type="button" class="disclose__button">Toggle</button>
    <div class="disclose__content">
        <p>Lorem ipsum dolor sit amet ...</p>
    </div>
</div>
```

The JavaScript to make the disclose widget work is simple, although it's missing the WAI-ARIA attributes at the moment.

```js
document.querySelectorAll(".disclose").forEach(function (disclose) {

    var button = disclose.querySelector(".disclose__button");
    var content = disclose.querySelector(".disclose__content");

    button.addEventListener("click", function () {
        content.hidden = !content.hidden;
    });

});
```

To add the WAI-ARIA attributes, we need to give the button 2 attributes:
- `aria-expanded` which should have the value `true` when the content is visible and `false` when it's hidden.
- `aria-controls` which should be set to the content's ID. Since it doesn't have a ID, we'll need to generate a unique one.

```js
// Without Aria.js
document.querySelectorAll(".disclose").forEach(function (disclose, i) {

    var button = disclose.querySelector(".disclose__button");
    var content = disclose.querySelector(".disclose__content");

    if (!content.id) {
        content.id = "disclose-" + i;
    }

    button.setAttribute("aria-controls", content.id);
    button.setAttribute("aria-expanded", !content.hidden);

    button.addEventListener("click", function () {
        content.hidden = !content.hidden;
        button.setAttribute("aria-expanded", !content.hidden);
    });

});
```

Aria.js simplifies working with the WAI-ARIA attributes: it reduces the amount of typing and it can generate a unique element ID.

```js
// With Aria.js
document.querySelectorAll(".disclose").forEach(function (disclose, i) {

    var button = disclose.querySelector(".disclose__button");
    var content = disclose.querySelector(".disclose__content");
    var aria = new Aria(button);

    aria.controls = content;
    aria.expanded = !content.hidden;

    button.addEventListener("click", function () {
        content.hidden = !content.hidden;
        aria.expanded = !content.hidden;
    });

});
```

The markup has been update, updating the `aria` object will update the attributes.

```html
<div class="disclose">
    <button
        type="button"
        class="disclose__button"
        aria-controls="ariajs-0"
        aria-expanded="true"
    >Toggle</button>
    <div class="disclose__content" id="ariajs-0">
        <p>Lorem ipsum dolor sit amet ...</p>
    </div>
</div>
```

Aria.js will also make reading the attribute easier as well. Instead of always returning a string like `getAttribute` does, Aria.js will return a value more similar to the type. For example, `aria-expanded` will return a boolean and `aria-controls` will return an array of elements.

```js
// With Aria.js
document.querySelectorAll(".disclose").forEach(function (disclose, i) {

    // ...
    aria.controls; // -> [<div id="ariajs-0">]
    aria.expanded; // -> true
    // ...

});
```

Aria.js will update its properties if the attribute value changes. This allows Aria.js to work along-side any other library or framework you're already using.

```html
<button aria-expanded="true">Button</button>

<script>
var button = document.querySelector("button");
var aria = new Aria(button);
button.setAttribute("aria-expanded", false);
aria.expanded; // -> false
</script>
```

Attributes can be removed by setting the value to an empty string.

```html
<button aria-expanded="true">Button</button>

<script>
var button = document.querySelector("button");
var aria = new Aria(button);
aria.expanded = "";
button; // -> <button>Button</button>
</script>
```

For more information, check out [the various types that Aria.js uses](types.md) and details about [the plugins to extend Aria.js](plugins.md).
