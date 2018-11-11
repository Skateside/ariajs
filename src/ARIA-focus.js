/**
 * A CSS selector identifying all elements that are automatically added into the
 * tab order. Elements are checked against this selector in
 * {@link ARIA.makeFocusable} and no action is taken on any element that matches
 * this selector.
 * @type {String}
 * @see https://www.w3.org/TR/html5/editing.html#the-tabindex-attribute
 */
ARIA.focusable = (
    "a[href]," +
    "audio[controls]," +
    "button," +
    "iframe," +
    "input:not([type=\"hidden\"])," +
    "link[href]," +
    "select," +
    "textarea," +
    "video[controls]," +
    "[contentEditable=\"true\"]," +
    "[draggable]," +
    "[tabindex]"
);

/**
 * Makes an element focusable. This is done by added a tabindex to the element
 * which can be optionally defined. If defined, the tabindex must be an integer
 * of -1 or at least 0 and at most 32767. If the given element would normally
 * be focusable (it matches {@link ARIA.focusable}) then no action is taken
 * unless the forceTabindex flag is passed.
 *
 * Be aware that this function doesn't check to see if other factors would
 * prevent the element gaining focus, such as it being disabled or hidden (or
 * having a disabled or hidden parent). As such, it is possible that the element
 * won't be focusable even after this function has run.
 *
 * @param {Element} element
 *        Element that should become focusable.
 * @param {Number|String} [tabindex=-1]
 *        Optional tab index that will be added to the element to make it
 *        focusable. The default is -1 meaning that the element will be
 *        focusable but not part of the tab order.
 * @param {Boolean} [forceTabindex=false]
 *        If set to true then the element will gain the tabindex attribute even
 *        if it matches {@link ARIA.focusable}.
 */
ARIA.makeFocusable = function (element, tabindex, forceTabindex) {

    if (!ARIA.is(element, ARIA.focusable) || forceTabindex) {

        if (tabindex === undefined) {
            tabindex = -1;
        } else if (tabindex !== -1 && tabindex !== "-1") {
            tabindex = Math.floor(Math.max(0, Math.min(32767, tabindex)));
        }

        if (!isNaN(tabindex)) {
            ARIA.setAttribute(element, "tabindex", tabindex);
        }

    }

};

/**
 * Resets the focusable state of the element by removing the tabindex element.
 *
 * Be aware that this doesn't prevent an element becoming focusable, it merely
 * resets the focusability to the element's default. Also be aware that this
 * function is not limited to only affect elements modified by
 * {@link ARIA.makeFocusable} - any element with a tabindex will be modified.
 *
 * @param {Element} element
 *        Element whose focusability should be reset.
 */
ARIA.resetFocusable = function (element) {
    ARIA.removeAttribute(element, "tabindex");
};
