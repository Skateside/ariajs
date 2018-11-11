/**
 * @file    Adds the MS proprietary "flowfrom" WAI-ARIA attribute.
 * @see     https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/x-ms-aria-flowfrom
 * @author  James "Skateside" Long
 * @license MIT
 */
(function (ARIA) {

    "use strict";

    var stem = "flowfrom";
    var normalised = "x-ms-aria-" + stem;

    if (ARIA && ARIA.VERSION) {

        // Add the suffix map to allow the attribute to generate the correct
        // suffix.
        ARIA.suffixMap[normalised] = stem;

        // Create the factory.
        ARIA.factories[stem] = function (element) {

            // Add a placeholder white-list for the factory.
            if (!ARIA.tokens[normalised]) {
                ARIA.tokens[normalised] = [];
            }

            return new ARIA.Reference(
                element,
                normalised,
                ARIA.tokens[normalised]
            );

        };

    }

}(window.ARIA));