/**
 * @file    Adds functions to check whether an element should be able to gain
 *          focus.
 * @author  James "Skateside" Long
 * @license MIT
 */
(function (ARIA) {

    "use strict";

    if (ARIA && ARIA.VERSION) {

        /**
         * A CSS selector identifying all elements that are automatically added
         * into the tab order.
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
         * Checks to see if the given element matches the given selector,
         * returning true if it does.
         *
         * @function
         * @param    {Element} element
         *           Element to test.
         * @param    {String} selector
         *           CSS selector to check against.
         * @return   {Boolean}
         *           true if the element matches the given selector, false
         *           otherwise.
         */
        ARIA.is = (
            Element.prototype.matches
            ? function (element, selector) {
                return element.matches(selector);
            }
            : (
                Element.prototype.msMatchesSelector
                ? function (element, selector) {
                    return element.msMatchesSelector(selector);
                }
                : function (element, selector) {

                    var elements = document.querySelectorAll(selector);
                    var length = elements.length;
                    var isMatch = false;

                    while (length) {

                        length -= 1;

                        if (elements[length] === element) {

                            isMatch = true;
                            break;

                        }

                    }

                    return isMatch;

                }
            )
        );

        /**
         * Checks to see if the given element is naturally able to gain focus.
         * Be aware that this function doesn't test external factors which may
         * affect the result such as whether the element is in the page or has
         * a hidden parent.
         *
         * @param  {Element} element
         *         Element to test.
         * @return {Boolean}
         *         true if the element should be able to gain focus, false
         *         otherwise.
         */
        ARIA.isFocusable = function (element) {
            return ARIA.is(element, ARIA.focusable);
        };

    }

}(window.ARIA));
