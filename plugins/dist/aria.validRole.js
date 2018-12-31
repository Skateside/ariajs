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
         * @type {Object}
         */
        ARIA.validRoles = objectAssign(Object.create(null), {
            "aria-activedescendant": [
                "application",
                // "composite", // (abstract)
                "group",
                "textbox",
                // inherited
                "combobox",
                "grid",
                "listbox",
                "menu",
                "menubar",
                "radiogroup",
                "row",
                "searchbox",
                // "select", // (abstract)
                "spinbutton",
                "tablist",
                "toolbar",
                "tree",
                "treegrid"
            ],
            "aria-autocomplete": [
                "combobox",
                "textbox",
                // inherited
                "searchbox"
            ],
            "aria-checked": [
                "checkbox",
                "option",
                "radio",
                "switch",
                // inherited
                "menuitemcheckbox",
                "menuitemradio",
                "treeitem"
            ],
            "aria-colcount": [
                "table",
                // inherited
                "grid",
                "treegrid"
            ],
            "aria-colindex": [
                "cell",
                "row",
                // inherited
                "columnheader",
                "gridcell",
                "rowheader"
            ],
            "aria-colspan": [
                "cell",
                // inherited
                "columnheader",
                "gridcell",
                "rowheader"
            ],
            "aria-expanded": [
                "button",
                "combobox",
                "document",
                "link",
                // "section", // (abstract)
                // "sectionhead", // (abstract)
                // "window", // (abstract)
                // inherited
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
                // "landmark", // (abstract)
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
                // "select", // (abstract)
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
            ],
            "aria-level": [
                "grid",
                "heading",
                "row",
                "tablist",
                // inherited
                "treegrid",
                "treeitem"
            ],
            "aria-modal": [
                // "window", // (abstract)
                // inherited
                "alertdialog",
                "dialog"
            ],
            "aria-multiline": [
                "textbox",
                // inherited
                "searchbox"
            ],
            "aria-multiselectable": [
                "grid",
                "listbox",
                "tablist",
                "tree",
                // inherited
                "treegrid"
            ],
            "aria-orientation": [
                "scrollbar",
                // "select", // (abstract)
                "separator",
                "slider",
                "tablist",
                "toolbar",
                // inherited
                "combobox",
                "listbox",
                "menu",
                "menubar",
                "radiogroup",
                "tree",
                "treegrid"
            ],
            "aria-placeholder": [
                "textbox",
                // inherited
                "searchbox"
            ],
            "aria-posinset": [
                "article",
                "listitem",
                "menuitem",
                "option",
                "radio",
                "tab",
                // inherited
                "menuitemcheckbox",
                "menuitemradio",
                "treeitem"
            ],
            "aria-pressed": [
                "button"
                // inherited
            ],
            "aria-readonly": [
                "checkbox",
                "combobox",
                "grid",
                "gridcell",
                "listbox",
                "radiogroup",
                "slider",
                "spinbutton",
                "textbox",
                // inherited
                "columnheader",
                "menuitemcheckbox",
                "menuitemradio",
                "rowheader",
                "searchbox",
                "switch",
                "treegrid"
            ],
            "aria-required": [
                "comboxbox",
                "gridcell",
                "listbox",
                "radiogroup",
                "spinbutton",
                "textbox",
                "tree",
                // inherited
                "columnheader",
                "rowheader",
                "searchbox",
                "treegrid"
            ],
            "aria-rowcount": [
                "table",
                // inherited
                "grid",
                "treegrid"
            ],
            "aria-rowindex": [
                "cell",
                "row",
                // inherited
                "columnheader",
                "gridcell",
                "rownheader"
            ],
            "aria-rowspan": [
                "cell",
                // inherited
                "columnheader",
                "gridcell",
                "rowheader"
            ],
            "aria-selected": [
                "gridcell",
                "option",
                "row",
                "tab",
                // inherited
                "columnheader",
                "rowheader",
                "treeitem"
            ],
            "aria-setsize": [
                "article",
                "listitem",
                "menuitem",
                "option",
                "radio",
                "tab",
                // inherited
                "menuitemcheckbox",
                "menuitemradio",
                "treeitem"
            ],
            "aria-sort": [
                "columnheader",
                "rowheader"
                // inherited
            ],
            "aria-valuemax": [
                // "range", // (abstract)
                "scrollbar",
                "separator",
                "slider",
                "spinbutton",
                // inherited
                "progressbar"
            ],
            "aria-valuemin": [
                // "range", // (abstract)
                "scrollbar",
                "separator",
                "slider",
                "spinbutton",
                // inherited
                "progressbar"
            ],
            "aria-valuenow": [
                // "range", // (abstract)
                "scrollbar",
                "separator",
                "slider",
                "spinbutton",
                // inherited
                "progressbar"
            ],
            "aria-valuetext": [
                // "range", // (abstract)
                "separator",
                // inherited
                "progressbar",
                "scrollbar",
                "slider",
                "spinbutton"
            ]
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
         * Checks to see that the given element has the correct role.
         *
         * @param  {Element} element
         *         Element to check.
         * @param  {String} attribute
         *         Attribute to check.
         * @return {Boolean}
         *         false if the element or does not have the correct role and
         *         {@link ARIA.failOnInvalidRole} is set to true. In all other
         *         cases, this will be true.
         */
        ARIA.isRoleValid = function (element, attribute) {

            var validRoles = ARIA.validRoles[attribute];
            var isValid = true;

            if (
                validRoles
                && validRoles.length
                && !ARIA.is(element, ARIA.makeRoleSelector(validRoles))
            ) {

                ARIA.warn(ARIA.supplant(ARIA.WARNING_INVALID_ROLE, [
                    attribute,
                    "'" + validRoles.join("', '") + "'"
                ]));

                if (ARIA.failOnInvalidRole) {
                    isValid = false;
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
