/**
 * @file     Adds validation that checks that the element gaining a WAI-ARIA
 *           attribute has the appropriate role and that a parent has an
 *           appropriate parent role.
 * @author   James "Skateside" Long
 * @license  MIT
 * @requires aria.tokens.js
 * @requires aria.focus.js
 */
(function (ARIA) {

    "use strict";

    /**
     * A simple wrapper for Array#slice.
     *
     * @private
     * @param   {Array|Object} arrayLike
     *          Array or array-like structure to slice.
     * @param   {Number} [offset]
     *          Optional offset for the slice.
     * @return  {Array}
     *          Sliced array.
     */
    var slice = function (arrayLike, offset) {
        return Array.prototype.slice.call(arrayLike, offset);
    };

    /**
     * A simple fall-back for Object.assign.
     *
     * @private
     * @param   {Object} source
     *          Source object to modify.
     * @param   {Object} [...objects]
     *          Additional objects to extend the first.
     * @return  {Object}
     *          Extended object.
     */
    var objectAssign = Object.assign || function (source) {

        slice(arguments, 1).forEach(function (object) {

            if (object) {

                Object.keys(object).forEach(function (key) {
                    source[key] = object[key];
                });

            }

        });

        return source;

    };

    if (ARIA && ARIA.tokens) {

        /**
         * The accepted roles for WAI-ARIA attributes. If the attribute isn't in
         * this list, it is assumed that it can be used on any element.
         * Each key in this object related to an object with "used" and
         * "inherited" keys. "used" is a white-list of roles for the current
         * element, "inherited" is a white-list of roles for parent elements.
         * @type {Object}
         */
        ARIA.acceptedRoles = objectAssign(Object.create(null), {
            "aria-activedescendant": {
                used: [
                    "application",
                    "composite",
                    "group",
                    "textbox"
                ],
                inherited: [
                    "combobox",
                    "grid",
                    "listbox",
                    "menu",
                    "menubar",
                    "radiogroup",
                    "row",
                    "searchbox",
                    "select",
                    "spinbutton",
                    "tablist",
                    "toolbar",
                    "tree",
                    "treegrid"
                ]
            },
            "aria-autocomplete": {
                used: [
                    "combobox",
                    "textbox"
                ],
                inherited: [
                    "searchbox"
                ]
            },
            "aria-checked": {
                used: [
                    "checkbox",
                    "option",
                    "radio",
                    "switch"
                ],
                inherited: [
                    "menuitemcheckbox",
                    "menuitemradio",
                    "treeitem"
                ]
            },
            "aria-colcount": {
                used: [
                    "table"
                ],
                inherited: [
                    "grid",
                    "treegrid"
                ]
            },
            "aria-colindex": {
                used: [
                    "cell",
                    "row"
                ],
                inherited: [
                    "columnheader",
                    "gridcell",
                    "rowheader"
                ]
            },
            "aria-colspan": {
                used: [
                    "cell"
                ],
                inherited: [
                    "columnheader",
                    "gridcell",
                    "rowheader"
                ]
            },
            "aria-expanded": {
                used: [
                    "button",
                    "combobox",
                    "document",
                    "link",
                    "section",
                    "sectionhead",
                    "window"
                ],
                inherited: [
                    "alert",
                    "alertdialog",
                    "article",
                    "banner",
                    "cell",
                    "columnheader",
                    "complementary",
                    "contentinfo",
                    "definition",
                    "dialog",
                    "directory",
                    "feed",
                    "figure",
                    "form",
                    "grid",
                    "gridcell",
                    "group",
                    "heading",
                    "img",
                    "landmark",
                    "list",
                    "listbox",
                    "listitem",
                    "log",
                    "main",
                    "marquee",
                    "math",
                    "menu",
                    "menubar",
                    "navigation",
                    "note",
                    "progressbar",
                    "radiogroup",
                    "region",
                    "row",
                    "rowheader",
                    "search",
                    "select",
                    "status",
                    "tab",
                    "table",
                    "tabpanel",
                    "term",
                    "timer",
                    "toolbar",
                    "tooltip",
                    "tree",
                    "treegrid",
                    "treeitem"
                ]
            },
            "aria-level": {
                used: [
                    "grid",
                    "heading",
                    "row",
                    "tablist"
                ],
                inherited: [
                    "treegrid",
                    "treeitem"
                ]
            },
            "aria-modal": {
                used: [
                    "window"
                ],
                inherited: [
                    "alertdialog",
                    "dialog"
                ]
            },
            "aria-multiline": {
                used: [
                    "textbox"
                ],
                inherited: [
                    "searchbox"
                ]
            },
            "aria-multiselectable": {
                used: [
                    "grid",
                    "listbox",
                    "tablist",
                    "tree"
                ],
                inherited: [
                    "treegrid"
                ]
            },
            "aria-orientation": {
                used: [
                    "scrollbar",
                    "select",
                    "separator",
                    "slider",
                    "tablist",
                    "toolbar"
                ],
                inherited: [
                    "combobox",
                    "listbox",
                    "menu",
                    "menubar",
                    "radiogroup",
                    "tree",
                    "treegrid"
                ]
            },
            "aria-placeholder": {
                used: [
                    "textbox"
                ],
                inherited: [
                    "searchbox"
                ]
            },
            "aria-posinset": {
                used: [
                    "article",
                    "listitem",
                    "menuitem",
                    "option",
                    "radio",
                    "tab"
                ],
                inherited: [
                    "menuitemcheckbox",
                    "menuitemradio",
                    "treeitem"
                ]
            },
            "aria-pressed": {
                used: [
                    "button"
                ],
                inherited: [
                ]
            },
            "aria-readonly": {
                used: [
                    "checkbox",
                    "combobox",
                    "grid",
                    "gridcell",
                    "listbox",
                    "radiogroup",
                    "slider",
                    "spinbutton",
                    "textbox"
                ],
                inherited: [
                    "columnheader",
                    "menuitemcheckbox",
                    "menuitemradio",
                    "rowheader",
                    "searchbox",
                    "switch",
                    "treegrid"
                ]
            },
            "aria-required": {
                used: [
                    "comboxbox",
                    "gridcell",
                    "listbox",
                    "radiogroup",
                    "spinbutton",
                    "textbox",
                    "tree"
                ],
                inherited: [
                    "columnheader",
                    "rowheader",
                    "searchbox",
                    "treegrid"
                ]
            },
            "aria-rowcount": {
                used: [
                    "table"
                ],
                inherited: [
                    "grid",
                    "treegrid"
                ]
            },
            "aria-rowindex": {
                used: [
                    "cell",
                    "row"
                ],
                inherited: [
                    "columnheader",
                    "gridcell",
                    "rownheader"
                ]
            },
            "aria-rowspan": {
                used: [
                    "cell"
                ],
                inherited: [
                    "columnheader",
                    "gridcell",
                    "rowheader"
                ]
            },
            "aria-selected": {
                used: [
                    "gridcell",
                    "option",
                    "row",
                    "tab"
                ],
                inherited: [
                    "columnheader",
                    "rowheader",
                    "treeitem"
                ]
            },
            "aria-setsize": {
                used: [
                    "article",
                    "listitem",
                    "menuitem",
                    "option",
                    "radio",
                    "tab"
                ],
                inherited: [
                    "menuitemcheckbox",
                    "menuitemradio",
                    "treeitem"
                ]
            },
            "aria-sort": {
                used: [
                    "columnheader",
                    "rowheader"
                ],
                inherited: [
                ]
            },
            "aria-valuemax": {
                used: [
                    "range",
                    "scrollbar",
                    "separator",
                    "slider",
                    "spinbutton"
                ],
                inherited: [
                    "progressbar"
                ]
            },
            "aria-valuemin": {
                used: [
                    "range",
                    "scrollbar",
                    "separator",
                    "slider",
                    "spinbutton"
                ],
                inherited: [
                    "progressbar"
                ]
            },
            "aria-valuenow": {
                used: [
                    "range",
                    "scrollbar",
                    "separator",
                    "slider",
                    "spinbutton"
                ],
                inherited: [
                    "progressbar"
                ]
            },
            "aria-valuetext": {
                used: [
                    "range",
                    "separator"
                ],
                inherited: [
                    "progressbar",
                    "scrollbar",
                    "slider",
                    "spinbutton"
                ]
            }
        });

        /**
         * If true, trying to set a WAI-ARIA attribute on an element without the
         * correct role set will fail.
         * @type {Boolean}
         */
        ARIA.failOnInvalidRole = false;

        /**
         * A warning message for the element not having the correct role.
         * @type {String}
         */
        ARIA.WARNING_INVALID_ROLE = (
            "The '{0}' attribute should be applied to an element having one " +
            "of these roles: {1}"
        );

        /**
         * A warning message for none of the element's parents having the
         * correct role.
         * @type {String}
         */
        ARIA.WARNING_INVALID_PARENT_ROLE = (
            "The '{0}' attribute should be applied to an element with a " +
            "parent that has one of these roles: {1}"
        );

        /**
         * Converts an array of roles into a CSS selector matching any of them.
         *
         * @param  {Array.<String>} roles
         *         Roles to convert into a CSS selector.
         * @return {String}
         *         CSS selector that matches any of the roles.
         */
        ARIA.makeRoleSelector = function (roles) {

            return roles.map(function (role) {
                return "[role~=\"" + role + "\"]";
            }).join(",");

        };

        /**
         * Gets the closest element to the given element which matches the given
         * selector. The given element is the first one checked so it may be
         * returned.
         *
         * @function
         * @param    {Element} element
         *           Starting element.
         * @param    {String} selector
         *           CSS selector of the element to find.
         * @return   {Element|null}
         *           Either the closest element or null if the element can't be
         *           found.
         */
        ARIA.closest = (
            Element.prototype.closest
            ? function (element, selector) {
                return element.closest(selector);
            }
            : function (element, selector) {

                var closest = null;

                while (
                    element
                    && element.nodeType === Node.ELEMENT_NODE
                    && document.documentElement.contains(element)
                ) {

                    if (ARIA.is(element, selector)) {

                        closest = element;
                        break;

                    }

                    element = element.parentNode;

                }

                return closest;

            }
        );

        /**
         * Checks to see that the given element has the correct role(s) or
         * parent role(s) to accept the given attribute.
         *
         * @param  {Element} element
         *         Element to check.
         * @param  {String} attribute
         *         Attribute to check.
         * @return {Boolean}
         *         false if the element or parent does not have the correct role
         *         and {@link ARIA.failOnInvalidRole} is set to true. In all
         *         other cases, this will be true.
         */
        ARIA.isRoleValid = function (element, attribute) {

            var validRoles = ARIA.acceptedRoles[attribute];
            var isValid = true;
            var selector = "";
            var warning = "";
            var closest = null;

            if (validRoles && validRoles.length) {

                selector = ARIA.makeRoleSelector(validRoles);

                if (!ARIA.is(element, selector)) {
                    warning = ARIA.WARNING_INVALID_ROLE;
                } else {

                    closest = ARIA.closest(element, selector);

                    if (closest && closest !== element) {
                        warning = ARIA.WARNING_INVALID_PARENT_ROLE;
                    }

                }

                if (warning) {

                    ARIA.warn(ARIA.supplant(warning, [
                        attribute,
                        "'" + validRoles.join("', '") + "'"
                    ]));

                    if (ARIA.failOnInvalidRole) {
                        isValid = false;
                    }

                }

            }

            return isValid;

        };

        // Add validation.
        ARIA.on(ARIA.EVENT_PRE_SET, function (e) {

            var detail = e.detail;

            if (!ARIA.isRoleValid(detail.element, detail.attribute)) {
                e.preventDefault();
            }

        });

    }

}(window.ARIA));

//# sourceMappingURL=aria.validRole.js.map
