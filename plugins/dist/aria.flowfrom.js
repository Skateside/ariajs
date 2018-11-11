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

        // Allow ARIA.normalise to return the correct value.
        ARIA.translate["aria-" + stem] = normalised;

        // Create the factory.
        ARIA.factories[stem] = ARIA.makeFactory(normalised, ARIA.Reference);

    }

}(window.ARIA));

//# sourceMappingURL=aria.flowfrom.js.map
