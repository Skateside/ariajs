/**
 * Map of all mis-spellings and aliases. The attribute key should be the
 * normalised value - see {@link ARIA.normalise}.
 * @type {Object}
 */
ARIA.translate = objectAssign(Object.create(null), {
    "aria-role": "role"
});

/**
 * Normalises an attribute name so that it is in lowercase and always starts
 * with "aria-". This function has the alias of {@link ARIA.normalize} and
 * changing one will update the other.
 *
 * @memberof ARIA
 * @name     normalise
 * @param    {String} attribute
 *           Attribute to normalise.
 * @return   {String}
 *           Normalised attribute.
 *
 * @example
 * ARIA.normalise("aria-busy"); // -> "aria-busy"
 * ARIA.normalise("busy"); // -> "aria-busy"
 * ARIA.normalise("  busy  "); // -> "aria-busy"
 * ARIA.normalise("BUSY"); // -> "aria-busy"
 */
var normalise = function (attribute) {

    var string = String(attribute)
        .toLowerCase()
        .replace(/^\s*(?:aria\-)?|\s*$/g, "");
    var normal = "aria-" + string;

    return ARIA.translate[normal] || normal;

};

var normaliseDescriptor = {

    configurable: false,
    enumerable: true,

    get: function () {
        return normalise;
    },

    set: function (normaliser) {
        normalise = normaliser;
    }

};

Object.defineProperties(ARIA, {

    normalise: normaliseDescriptor,

    /**
     * An alias of {@link ARIA.normalise}.
     *
     * @memberof ARIA
     * @function
     */
    normalize: normaliseDescriptor

});

/**
 * A map of all conversions for {@link ARIA.getSuffix}. As well as acting like a
 * cache for frequent conversions, this also allows plugins to use un-expected
 * attribute names since the conversion can be added here.
 * @type {Object}
 */
ARIA.suffixMap = Object.create(null);

/**
 * Converts the attribute into the WAI-ARIA suffix (e.g. "aria-label" becomes
 * "label" etc.).
 *
 * @param  {String} attribute
 *         Attribute whose suffix should be returned.
 * @return {String}
 *         Suffix of the attribute.
 */
ARIA.getSuffix = function (attribute) {

    var mapped = ARIA.suffixMap[attribute];

    if (!mapped) {

        mapped = attribute.replace(/^aria\-/, "");
        ARIA.suffixMap[attribute] = mapped;

    }

    return mapped;

};